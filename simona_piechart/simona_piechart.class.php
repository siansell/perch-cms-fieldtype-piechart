<?php
class PerchFieldType_simona_piechart extends PerchAPI_FieldType
{

  /* Allowable tags:

  */

  public $processed_output_is_markup = true;

  private $_location = "/perch/addons/fieldtypes/simona_piechart/";
  private $_handsontable_location = "/perch/addons/fieldtypes/simona_piechart/handsontable-0.19.0/dist/";

  public function add_page_resources()
  {
    //this function seems to be called twice for some reason (Perch Runway)?
    $Perch = Perch::fetch();
    $Perch->add_css($this->_location. 'css/simona_piechart_admin.css');
    $Perch->add_css($this->_handsontable_location. 'handsontable.full.min.css');
    $Perch->add_javascript('https://www.google.com/jsapi');
    $Perch->add_javascript($this->_handsontable_location. 'handsontable.full.min.js');
    $Perch->add_javascript($this->_location. 'js/simona_piechart_admin.js');
  }

  public function render_inputs($details=array()) {

    // PerchUtil::debug($details);

    $id = $this->Tag->input_id();

    $title = isset($details[$id]['title']) ? $this->Form->get($details[$id], 'title') : 'My Favourite Pie';
    $is3d = isset($details[$id]['is3d']) ? $this->Form->get($details[$id], 'is3d') : false;
    $data = isset($details[$id]['data']) ? $this->Form->get($details[$id], 'data') : '[["Steak",7,"#e0440e"],["Kidney",12,"#e6693e"],["Mushrooms", 4, "#ec8f6e"]]';
    // PerchUtil::debug($data);

    $s = '<div class="simona_piechart">';
    $s.= '  <div class="simona_piechart_row">';
    $s.=      $this->Form->label($id. '_title', 'Chart title', '', true);
    $s.=      $this->Form->text($id. '_title', $title);
    $s.= '  </div>';
    $s.= '  <div class="simona_piechart_row">';
    $s.=      $this->Form->label($id. '_is3d', 'Is 3D', '', true);
    $s.=      $this->Form->checkbox($id. '_is3d', true, $is3d);
    $s.= '  </div>';
    $s.= '  <div class="simona_piechart_row">';
    $s.=      $this->Form->label('simona_piechart_'. $id. '_data', 'Data', '', true);
    $s.= '  <div class="simona_hot">';
    $s.= '    <div id="simona_piechart_data_'. $id. '"></div>';
    $s.= '  </div>';
    $s.= '  </div>';
    $s.= '  <div id="simona_piechart_chart_'. $id. '" data-title="'. $title. '" data-is3d="'. $is3d. '"></div>';
    $s.= '</div>';
    $s.= $this->Form->hidden($id. '_data',  $data);
    return $s;

  }

  public function get_raw($post=false, $Item=false) {
    $id = $this->Tag->id();
    $out = array();
    if (isset($post[$id. '_title']) && trim($post[$id. '_title']) !== '') {
      $title = PerchUtil::safe_stripslashes(trim($post[$id. '_title']));
      $out['title'] = $title;
    } else {
      $out['title'] = '';
    }
    $out['_title'] = $out['title'];
    if (isset($post[$id. '_is3d']) && trim($post[$id. '_is3d']) !== '') {
      $out['is3d'] = $post[$id. '_is3d'];
    } else {
      $out['is3d'] = false;
    }
    $width = ($this->Tag->width() === false) ? "460" : $this->Tag->width();
    $out['width'] = $width;
    $height = ($this->Tag->height() === false) ? "320" : $this->Tag->height();
    $out['height'] = $height;
    if (isset($post[$id. '_data']) && trim($post[$id. '_data']) !== '') {
      $out['data'] = $post[$id. '_data'];
    } else {
      $out['data'] = '[]';
    }
    $out['chart_id'] = $this->unique_id;
    return $out;
  }

  public function get_processed($raw=false) {

    PerchUtil::debug($raw);

    $html = '<div id="simona_piechart_'. $raw['chart_id']. '">Loading chart...</div>';

    $is3d = ($raw['is3d']) ? 'true' : 'false';

    $r = '<script type="text/javascript">/* <![CDATA[ */ ';
    $r .= <<< EOT
if (typeof CMSPieChart =='undefined') {
  var CMSPieChart={};
  CMSPieChart.charts=[];
  document.write('<scr'+'ipt type="text\/javascript" src="{$this->_location}js/simona_piechart_public.js"><'+'\/sc'+'ript>');
}
CMSPieChart.charts.push({
  'chart_id':'simona_piechart_{$raw['chart_id']}',
  'title':'{$raw['title']}',
  'data':'{$raw['data']}',
  'width':'{$raw['width']}',
  'height':'{$raw['height']}',
  'is3d':{$is3d},
});
EOT;
    $r .= '/* ]]> */';
    $r .= '</script>';

    $out = $html. $r;
    return $out;
  }

  public function get_search_text($raw=false) {
    return false;
  }

  public function render_admin_listing($raw=false) {
    return false;
  }

}
?>
