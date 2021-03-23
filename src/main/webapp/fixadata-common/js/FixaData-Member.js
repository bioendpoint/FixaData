
Member = {};

Member.Login = {};

Member.Login.Submit = function( objForm ) {
	var response = Core.Member.Login.Submit( objForm ,'Member.Login.SubmitResponse' );
	if ( !response.Response ) {
		Member.Login.Error( response.ResponseValue );
	};
	return false;
};

Member.Login.SubmitResponse = function( d ,e ) {
	var response = d.Response;
	if ( response ) {
		window.location.href = Options.Uri.Url.DataInput;
	} else {
		Member.Login.Error( d.ResponseValue );
	};
};

Member.Login.Error = function( responseValue ) {
	var responseValue	= parseInt(responseValue);
	var message			= [];
		message[0]		= '';
		message[1]		= Options.Message.Error.Errr1101;
		message[2]		= Options.Message.Error.Errr1102;
		message[3]		= Options.Message.Error.Errr1103;
		message[4]		= Options.Message.Error.Errr1104;
	Options.Element.Member.LoginMessage.El().css('display' ,'block').html(message[responseValue].Message);
};

inni.fn.Login = function() {
	return Member.Login.Submit( $i(this) );
};

Member.Start = function () {
	Options.Menu.Level1();
	Core.Start( function( response ) {
		if ( response ) {
			Options.Element.Member.LoginForm.El().SetForm();
		};
	} );
};


$i(document).ready( function( e ) {
//	Member.Start();
});
