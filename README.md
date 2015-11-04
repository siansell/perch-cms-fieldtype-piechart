# perch-cms-fieldtype-piechart

Piechart fieldtype for [Perch CMS](http://grabaperch.com).

**This README document is a work in progress.**

## Installation

Download and place the `simona_piechart` folder within `perch/addons/fieldtypes`.

## Usage

Once installed, the fieldtype can be used in a template by setting the `type` attribute to `simona_piechart`:

`<perch:content id="piechart" type="simona_piechart" label="Pie Chart" title="true" />`

An example basic template is supplied in the `templates` folder.

Piechart data is editable within Perch. The chartpreview should update in real time. To add and remove rows, right click and use the context menu.

### Attributes

**width**
Set the width attribute to control the width of the output chart (default: `460`). Example: `width="300"`.

**height**
Set the height attribute to control the height of the output chart (default: `320`). Example: `height="300"`.

## Credits

* handsontable: http://handsontable.com/
* Google Charts: https://developers.google.com/chart/?hl=en

## License

perch-cms-fieldtype-piechart is released under the [MIT License](https://github.com/siansell/perch-cms-fieldtype-piechart/blob/master/LICENSE).
