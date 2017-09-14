Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}
function base64ToBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
}
$(document).ready(function () {
        var cy = cytoscape({
          container: $('#cy'),
          boxSelectionEnabled: false,
          autounselectify: true,
          layout: {
            name: 'dagre',
            rankDir: 'LR',
            ranker: 'longest-path',
            spacingFactor: 2

          },
          style: [
            {
              selector: 'node',
              style: {
                'content': 'data(id)',
                'text-opacity': 0.5,
                'text-valign': 'center',
                'text-halign': 'center',
                'font-family': 'Courier Serif',
                'font-size': '10px',
                'font-weight': 300,
                'padding': '4px',
                'shape': 'roundrectangle',
                'background-color': 'white',
                'width': 'label',
                'height': 'label',
                'text-wrap': 'wrap',
                'text-outline-color': 'black',
                'color':  '#dd0000',
                'border-width' : '2px',
                'border-style' : 'double',
                'border-color':  'black'

              }
            },
            {
              selector: 'edge',
              style: {
                'target-arrow-shape': 'triangle',
                'line-color': '#bbb',
                'target-arrow-color': '#bbb',
                'curve-style': 'bezier',
                'width': 'data(width)',         
              }
            },
            {
              selector: '.label',
              style: {
                'label': 'data(weight)',
                'text-margin-y': -10,
                'font-size': '8px'
              }
            },
            {
              selector: 'core',
              style: {
                'active-bg-size': '15px',
                'selection-box-color' : 'red',
                'selection-box-border-color' : 'red',
                'selection-box-opacity': '0.5'
              }
            }
          ]
        });

$( "#show" ).click(function() {

    var linedata = $('#edgelist').val().split("\n");
    var nodeset = [];
    var edata = [];
    var ndata = [];
    var curline;
    var weight;
    var haserror = false;
    var errorline = "";
    var max_weight = -1;
    var has_weight = false;
    var min_weight = Math.pow(10,10);
    for(var i = 0; i<linedata.length; i++){
      curline = linedata[i].split(/\s+/g);
      weight = 1;
      if (curline.length <2 || curline.length >3){
        haserror = true;
        errorline = curline;
      }      
      else if(curline.length > 2){
         weight = parseFloat(curline[2]);
         has_weight = true;
      }
      min_weight = Math.min(min_weight, weight);
      max_weight = Math.max(max_weight, weight);
      nodeset.push(curline[0]);
      nodeset.push(curline[1]);
      edata.push({group: 'edges', data: { id: curline[0]+curline[1], weight: weight, source: curline[0], target: curline[1] } })

    }
  
    if(haserror){
      $( "#error" ).toggle(true);
      $( "#error" ).text("Incorrect input format!, please check this line: "+ errorline);

    }
    else {
        nodeset = nodeset.unique();
        for(i=0; i< nodeset.length; i++){
          ndata.push({group:'nodes', data: {id: nodeset[i]} });
        }
        var a =  ((max_weight - min_weight) / 3 || 1)

        for(i=0; i<edata.length; i++){
          edata[i].data.width = Math.round((1 + (edata[i].data.weight - min_weight) / a)*100) /100;
        }
        $( "#error" ).toggle(false);
        cy.json({ elements:  ndata.concat(edata) });
        if(has_weight){
          
          cy.$('edge').addClass('label');
        }
        else if(cy.$('edge').hasClass('label')){
          cy.$('edge').removeClass('label'); 
        }

        var layout = cy.makeLayout({ name: 'dagre',
                                     rankDir: 'LR',
                                     ranker: 'longest-path',
                                     spacingFactor: 2
                                  });
        layout.run();

      }


  });
$( "#save" ).click(function() {
  var b64key = 'base64,';
  var cypng = cy.png({full:true, maxWidth:1920, maxHeight:1200})
  var b64 = cypng.substring( cypng.indexOf(b64key) + b64key.length );
  var imgBlob = base64ToBlob( b64, 'image/png' );
  saveAs( imgBlob, 'graph.png' );
});

});