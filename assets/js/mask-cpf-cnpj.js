/**
 * Live input masking for the CPF/CNPJ checkout fields.
 *
 * The fields are React-controlled inputs (WooCommerce Blocks Additional
 * Checkout Fields). Event delegation on `document` is used instead of
 * per-node listeners because the fields are conditionally mounted/unmounted
 * (CPF only shows for "Pessoa física", CNPJ only for "Pessoa jurídica") and
 * delegation needs no re-binding when the underlying node is replaced.
 */
( function () {
	'use strict';

	var CPF_ID = 'contact-swcbcf-cpf';
	var CNPJ_ID = 'contact-swcbcf-cnpj';

	var nativeValueSetterDescriptor = window.HTMLInputElement && Object.getOwnPropertyDescriptor( window.HTMLInputElement.prototype, 'value' );
	var nativeValueSetter = nativeValueSetterDescriptor && nativeValueSetterDescriptor.set;

	// Element -> last known raw (unmasked) value, used to smooth backspacing over a separator.
	var prevRaw = new WeakMap();

	function extractCPF( value ) {
		return value.replace( /[^0-9]/g, '' ).slice( 0, 11 );
	}

	function maskCPF( raw ) {
		var out = '';
		for ( var i = 0; i < raw.length; i++ ) {
			if ( 3 === i || 6 === i ) {
				out += '.';
			}
			if ( 9 === i ) {
				out += '-';
			}
			out += raw[ i ];
		}
		return out;
	}

	function extractCNPJ( value ) {
		var cleaned = value.replace( /[^0-9A-Za-z]/g, '' ).toUpperCase();
		var head = cleaned.slice( 0, 12 );
		var tail = cleaned.slice( 12 ).replace( /[^0-9]/g, '' ).slice( 0, 2 );
		return head + tail;
	}

	function maskCNPJ( raw ) {
		var out = '';
		for ( var i = 0; i < raw.length; i++ ) {
			if ( 2 === i || 5 === i ) {
				out += '.';
			}
			if ( 8 === i ) {
				out += '/';
			}
			if ( 12 === i ) {
				out += '-';
			}
			out += raw[ i ];
		}
		return out;
	}

	// Native `pattern` attributes on these fields are sized for the raw
	// (unmasked) value, so they must be widened to match the masked format —
	// otherwise the browser's own constraint validation rejects the punctuation
	// this script just added.
	var CPF_PATTERN = '^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$';
	var CNPJ_PATTERN = '^[0-9A-Z]{2}\\.[0-9A-Z]{3}\\.[0-9A-Z]{3}/[0-9A-Z]{4}-[0-9]{2}$';

	function fieldConfig( id ) {
		if ( CPF_ID === id ) {
			return { extract: extractCPF, mask: maskCPF, maxlength: '14', pattern: CPF_PATTERN, separators: [ '.', '-' ] };
		}
		if ( CNPJ_ID === id ) {
			return { extract: extractCNPJ, mask: maskCNPJ, maxlength: '18', pattern: CNPJ_PATTERN, separators: [ '.', '/', '-' ] };
		}
		return null;
	}

	function countRawBefore( value, cursor, separators ) {
		var count = 0;
		for ( var i = 0; i < cursor && i < value.length; i++ ) {
			if ( -1 === separators.indexOf( value[ i ] ) ) {
				count++;
			}
		}
		return count;
	}

	function mapRawCountToIndex( masked, targetCount, separators ) {
		var count = 0;
		for ( var i = 0; i < masked.length; i++ ) {
			if ( count === targetCount ) {
				return i;
			}
			if ( -1 === separators.indexOf( masked[ i ] ) ) {
				count++;
			}
		}
		return masked.length;
	}

	function setNativeValue( input, value ) {
		if ( nativeValueSetter ) {
			nativeValueSetter.call( input, value );
		} else {
			input.value = value;
		}
	}

	function onFocusIn( event ) {
		var config = fieldConfig( event.target && event.target.id );
		if ( ! config ) {
			return;
		}
		// Widen the native cap before the user can type/paste, so nothing gets
		// silently truncated by the browser prior to our own input handling.
		event.target.setAttribute( 'maxlength', config.maxlength );
		// Relax the native pattern to match the masked format instead of the raw one.
		event.target.setAttribute( 'pattern', config.pattern );
	}

	function onInput( event ) {
		var input = event.target;
		var config = fieldConfig( input && input.id );
		if ( ! config ) {
			return;
		}

		input.setAttribute( 'maxlength', config.maxlength );
		input.setAttribute( 'pattern', config.pattern );

		var currentValue = input.value;
		var raw = config.extract( currentValue );

		if ( 'deleteContentBackward' === event.inputType ) {
			var previousRaw = prevRaw.get( input );
			if ( undefined !== previousRaw && raw.length === previousRaw.length && raw.length > 0 ) {
				raw = raw.slice( 0, -1 );
			}
		}

		var masked = config.mask( raw );
		prevRaw.set( input, raw );

		if ( masked === currentValue ) {
			// Idempotent: nothing to change. Also terminates the re-entrant call
			// caused by the synthetic 'input' event dispatched below.
			return;
		}

		var cursor = input.selectionStart;
		var rawBeforeCursor = countRawBefore( currentValue, cursor, config.separators );

		setNativeValue( input, masked );

		var newCursor = mapRawCountToIndex( masked, rawBeforeCursor, config.separators );
		input.setSelectionRange( newCursor, newCursor );

		// Let React's change tracking pick up the programmatic value change.
		input.dispatchEvent( new Event( 'input', { bubbles: true } ) );
	}

	document.addEventListener( 'focusin', onFocusIn, false );
	document.addEventListener( 'input', onInput, false );
} )();
