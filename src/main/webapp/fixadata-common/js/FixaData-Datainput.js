
Datainput = {};



Datainput.Start = function() {
	Options.Menu.Level2();
	Core.Start( function( response ) {
		if ( response ) {
			Core.Files.Create( 'Datainput.SubmitResponse' );
		};
	} );
};

Datainput.SubmitResponse = function( d ,e ) {
	window.location.href = Options.Uri.Ajax.DatainputReturn.Upload;
};



$i(document).ready( function( e ) {
	Datainput.Start();
} );
