<?php
/**
 * Plugin Name:          Simple Checkout Fields Manager for WooCommerce - Validate CPF/CNPJ
 * Plugin URI:
 * Description:          Validates CPF and CNPJ fields in the Simple Checkout Fields Manager for WooCommerce plugin
 * Version:              1.2
 * Author:               Naked Cat Plugins (by Webdados)
 * Author URI:           https://nakedcatplugins.com
 * Text Domain:          simple-woo-checkout-blocks-cf-validate-cpf-cnpj
 * Requires at least:    6.3
 * Tested up to:         7.0
 * Requires PHP:         7.4
 * Update URI:           false
 * WC requires at least: 8.9
 * WC tested up to:      10.9
 * Requires Plugins:     woocommerce, simple-woo-checkout-blocks-cf
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Load plugin textdomain.
add_action(
	'init',
	function () {
		load_plugin_textdomain( 'simple-woo-checkout-blocks-cf-validate-cpf-cnpj', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
	}
);

// Add plugin initialization hook.
add_action( 'woocommerce_init', 'swcbcf_init_validate_cpf_cnpj', 1 );

/**
 * Plugin initialization function.
 */
function swcbcf_init_validate_cpf_cnpj() {

	// Validate CPF
	add_filter(
		'swcbcf_validate_callback_contact_cpf',
		function ( $to_return, $value, $field ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed

			// Custom validation logic for CPF field
			$cpf = preg_replace( '/[^0-9]/', '', $value );

			if ( 11 !== strlen( $cpf ) || preg_match( '/^([0-9])\1+$/', $cpf ) ) {
				return __( 'The CPF field is invalid: it does not have 11 digits', 'simple-woo-checkout-blocks-cf-validate-cpf-cnpj' );
			}

			$digit = substr( $cpf, 0, 9 );

			for ( $j = 10; $j <= 11; $j++ ) {
				$sum = 0;

				for ( $i = 0; $i < $j - 1; $i++ ) {
					$sum += ( $j - $i ) * intval( $digit[ $i ] );
				}

				$summod11        = $sum % 11;
				$digit[ $j - 1 ] = $summod11 < 2 ? 0 : 11 - $summod11;
			}

			if (
				intval( $digit[9] ) !== intval( $cpf[9] )
				||
				intval( $digit[10] ) !== intval( $cpf[10] )
			) {
				return __( 'The CPF field is invalid: verification digits do not match', 'simple-woo-checkout-blocks-cf-validate-cpf-cnpj' );
			}

			return $to_return;
		},
		10,
		3
	);

	// Validate CNPJ
	add_filter(
		'swcbcf_validate_callback_contact_cnpj',
		function ( $to_return, $value, $field ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed

			// Custom validation logic for CNPJ field.
			$cnpj = strtoupper( preg_replace( '/[^0-9A-Za-z]/', '', $value ) );

			if ( ! preg_match( '/^[0-9A-Z]{12}[0-9]{2}$/', $cnpj ) || preg_match( '/^(.)\1+$/', $cnpj ) ) {
				return __( 'The CNPJ field is invalid: it does not have 14 characters', 'simple-woo-checkout-blocks-cf-validate-cpf-cnpj' );
			}

			$digit = substr( $cnpj, 0, 12 );

			for ( $j = 0; $j < 2; $j++ ) {
				$sum    = 0;
				$weight = ( 0 === $j ) ? 5 : 6;
				$length = strlen( $digit );

				for ( $i = 0; $i < $length; $i++ ) {
					$sum += $weight * ( ord( $digit[ $i ] ) - 48 );

					$weight--;

					if ( 1 === $weight ) {
						$weight = 9;
					}
				}

				$remainder = $sum % 11;
				$digit    .= ( $remainder < 2 ) ? '0' : (string) ( 11 - $remainder );
			}

			if ( ! ( intval( $digit[12] ) === intval( $cnpj[12] ) && intval( $digit[13] ) === intval( $cnpj[13] ) ) ) {
				return __( 'The CNPJ field is invalid: verification digits do not match', 'simple-woo-checkout-blocks-cf-validate-cpf-cnpj' );
			}

			return $to_return;
		},
		10,
		3
	);
}

/**
 * Declare HPOS and Blocks compatibility
 */
add_action(
	'before_woocommerce_init',
	function () {
		if ( class_exists( '\Automattic\WooCommerce\Utilities\FeaturesUtil' ) ) {
			\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
			\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'cart_checkout_blocks', __FILE__, true );
		}
	}
);
