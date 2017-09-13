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
            name: 'dagre'
          },
          style: [
            {
              selector: 'node',
              style: {
                'content': 'data(id)',
                'text-opacity': 0.5,
                'text-valign': 'center',
                'text-halign': 'right',
                'background-color': '#11479e'
              }
            },
            {
              selector: 'edge',
              style: {
                'width': 4,
                'target-arrow-shape': 'triangle',
                'line-color': '#9dbaea',
                'target-arrow-color': '#9dbaea',
                'curve-style': 'bezier'
              }
            }
          ]
        });

$( "#show" ).click(function() {

    var olddata = cy.filter(function(i, ele) {
        return true;
    });
    var linedata = $('#edgelist').val().split("\n");
    var nodeset = [];
    var edata = [];
    var ndata = [];
    var curline;
    var weight;
    var haserror = false;
    var errorline = "";
    for(var i = 0; i<linedata.length; i++){
      curline = linedata[i].split(/\s+/g);
      weight = 1;
      if (curline.length <2 || curline.length >3){
        haserror = true;
        errorline = curline;
      }      
      else if(curline.length > 2){
         weight = parseFloat(curline[2]);
      }
      nodeset.push(curline[0]);
      nodeset.push(curline[1]);
      edata.push({ group: 'edges', data: { id: curline[0]+curline[1], weight: weight, source: curline[0], target: curline[1] } })

    }

    olddata.remove();
    if(haserror){
      $( "#error" ).toggle(true);
      $( "#error" ).text("Incorrect input format!, please check this line: "+ errorline);

    }
    else {
        for(i=0; i< nodeset.length; i++){
          ndata.push({group: 'nodes', data: {id: nodeset[i]} });
        }
        $( "#error" ).toggle(false);

        cy.add(ndata);
        cy.add(edata);
      }

  });
$( "#save" ).click(function() {
  var b64key = 'base64,';
  var b64 = cy.png().substring( cy.png().indexOf(b64key) + b64key.length );
  var imgBlob = base64ToBlob( b64, 'image/png' );
  saveAs( imgBlob, 'graph.png' );
});

});