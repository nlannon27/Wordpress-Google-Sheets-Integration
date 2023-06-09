import { __ } from '@wordpress/i18n';

import { useBlockProps, InspectorControls, RichText, PanelColorSettings } from '@wordpress/block-editor';
import { FontSizePicker, PanelBody, SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import { __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {
	const fontSizes = [
		{ name: __( 'Small' ), slug: 'small', size: 16 },
		{ name: __( 'Medium' ), slug: 'medium', size: 28 },
		{ name: __( 'Large' ), slug: 'large', size: 40 },
		{ name: __( 'Extra Large' ), slug: 'xlarge', size: 52 },
	];

	const alignmentOptions = [
		{ label: 'Right', value: 'right' },
		{ label: 'Left', value: 'left' },
		{ label: 'Center', value: 'center' },
	];

	const DescriptionText = (objectStyle) => {
		objectStyle["textAlign"] = attributes.descriptionAlignment;
		objectStyle["fontSize"] = attributes.descriptionSize;
		objectStyle["color"] = attributes.descriptionColor;
		
		if(attributes.descriptionLocation == "" || attributes.descriptionLocation == undefined) {
			return (
				<RichText
					tagName="p"
					style={ objectStyle }
					onChange={ ( newDescription ) => {
						setAttributes( { description: newDescription } );
					} }
					value={ attributes.description }
				/>
			);
		} else {
			return (
				<p style={ objectStyle }>
					Description
				</p>
			)
		}
	}

	const DataText = (objectStyle) => {
		objectStyle["textAlign"] = attributes.dataAlignment;
		objectStyle["fontSize"] = attributes.dataSize;
		objectStyle["color"] = attributes.dataColor;

		return (
			<p style={ objectStyle }>
				{attributes.dataPrefix}#,###,###{attributes.dataSuffix}
			</p>
		);
	}

	const DisplayText = (flipPositions) => {
		const topStyle = { marginBottom: 0, paddingBottom: 0 };
		const bottomStyle = { marginTop: 0, paddingTop: 0 };

		let top = (flipPositions ? DescriptionText(topStyle) : DataText(topStyle));
		let bottom = (flipPositions ? DataText(bottomStyle) : DescriptionText(bottomStyle));

		return (
			<div>
				{top}
				{bottom}
			</div>
		);
	}

	return (
		<div { ...useBlockProps() }>
			<Fragment>
				<InspectorControls>
					<PanelBody title="Sheet Settings" initialOpen={ true }>
						<TextControl
							label="Google Sheet CSV URL"
							value={ attributes.sheetCSVURL }
							onChange={ ( newURL ) =>
								setAttributes( { sheetCSVURL: newURL } )
							}
							help="The link to a CSV of your google sheet. Can be obtained to File > Share > Publish to the Web > Change from Web Page to Comma Separated Values > Publish"
						/>

						<TextControl
							label="Data Cell Coordinate"
							value={ attributes.dataLocation }
							onChange={ ( newCoordinate ) =>
								setAttributes( { dataLocation: newCoordinate } )
							}
							help="The coordinate to pull data from, example: A1"
						/>

						<TextControl
							label="Description Cell Coordinate"
							value={ attributes.descriptionLocation }
							onChange={ ( newCoordinate ) =>
								setAttributes( { descriptionLocation: newCoordinate } )
							}
							help="The coordinate to pull description from, leave blank to customize manually"
						/>
					</PanelBody>

					<PanelBody title="Text Formatting" initialOpen={ true }>
						<ToggleControl
							label="Flip Positions"
							help={ "Controls whether the data or description comes first" }
							checked={ attributes.flipPositions }
							onChange={ (newToggle) => 
								setAttributes( {
									flipPositions: newToggle
								} )
							}
						/>

						<ToggleControl
							label="Animated Counting"
							help={ "Makes any number within the data field count up from 0 when viewed - NOTE: Will not work with non-numerical input" }
							checked={ attributes.animatedCounting }
							onChange={ (newToggle) => 
								setAttributes( {
									animatedCounting: newToggle
								} )
							}
						/>

						{attributes.animatedCounting && 
							<>
							<NumberControl
								label="Animated Counter Duration"
								value={ attributes.countDuration }
								onChange={ (newDuration) =>
									setAttributes( {countDuration: newDuration} )
								}
								min={1}
							/>

							<p style={ { fontSize: 12, color: 'rgb(117, 117, 117)' } }>The time (ms) it takes for the number to count up</p>
							</>
						}

						<PanelBody title="Affixes" initialOpen={ false }>
							<TextControl
								label="Data Prefix"
								value={ attributes.dataPrefix }
								onChange={ ( newAffix ) =>
									setAttributes( { dataPrefix: newAffix } )
								}
								help="Appends to the start of the data element"
							/>

							<TextControl
								label="Data Suffix"
								value={ attributes.dataSuffix }
								onChange={ ( newAffix ) =>
									setAttributes( { dataSuffix: newAffix } )
								}
								help="Appends to the end of the data element"
							/>
						</PanelBody>

						<PanelBody title="Font Size" initialOpen={ false }>
							<b style={ { fontSize: 11 } }>DATA FONT SIZE</b>
							<FontSizePicker
								fontSizes={ fontSizes }
								value={ attributes.dataSize }
								onChange={ ( newFontSize ) =>
									setAttributes( { dataSize: newFontSize } )
								}
							/>

							<b style={ { fontSize: 11 } }>DESCRIPTION FONT SIZE</b>
							<FontSizePicker
								fontSizes={ fontSizes }
								value={ attributes.descriptionSize }
								onChange={ ( newFontSize ) =>
									setAttributes( {
										descriptionSize: newFontSize,
									} )
								}
							/>
						</PanelBody>
						
						<PanelBody title="Alignment" initialOpen={ false }>
							<SelectControl
								label="Data Alignment"
								value={ attributes.dataAlignment }
								options={ alignmentOptions }
								help="The horizontal alignment of the google sheets data"
								onChange={ ( newAlignment ) =>
									setAttributes( { dataAlignment: newAlignment } )
								}
							/>

							<SelectControl
								label="Description Alignment"
								value={ attributes.descriptionAlignment }
								options={ alignmentOptions }
								help="The horizontal alignment of the description text"
								onChange={ ( newAlignment ) =>
									setAttributes( {
										descriptionAlignment: newAlignment,
									} )
								}
							/>
						</PanelBody>

						<PanelColorSettings
							title={ __( 'Color Settings' ) }
							colorSettings={ [
								{
									label: __( 'Data Text Color' ),
									onChange: ( newColor ) =>
										setAttributes( {
											dataColor: newColor,
										} ),
									value: attributes.dataColor,
								},
								{
									label: __( 'Description Text Color' ),
									onChange: ( newColor ) =>
										setAttributes( {
											descriptionColor: newColor,
										} ),
									value: attributes.descriptionColor,
								}
							] }
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>

			{DisplayText(attributes.flipPositions)}
			
		</div>
	);
}
