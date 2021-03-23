<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<script>
var multi_language = "<spring:eval expression="@globals['Globals.multi_language']"/>";
var version = "<spring:eval expression="@globals['Globals.version']"/>";
var multi_sheet = "<spring:eval expression="@globals['Globals.multi_sheet']"/>";



var auth = <%= session.getAttribute("SESSION_USER_AUTH") %>;
var fixa_lang = {};
 
function lang_return(key)
{
	
	
	key = key.replace(".","_").replace(".","_");
	
	//console.log("lang_key",key);
	//console.log("lang_value",fixa_lang[key]);
	
	return fixa_lang[key];
}

function lang_return2(key,  rep)
{
	try{
	var str = lang_return(key);
	return str.replace("{0}",rep);
	}catch(e)
	{
		return e;
	}
}

function lang_return3(key, rep, rep2)
{
	try{
	var str = lang_return(key);
	str = str.replace("{0}",rep);
	str = str.replace("{1}",rep2);
	
	return str;
	
	}catch(e)
	{
		return e;
	}
}

function lang_return4(key, rep, rep2, rep3)
{
	try{
	var str = lang_return(key);
	str = str.replace("{0}",rep);
	str = str.replace("{1}",rep2);
	str = str.replace("{2}",rep3);
	
	return str;
	
	}catch(e)
	{
		return e;
	}
}




fixa_lang["fixa_core_title001"] = "<spring:message code="fixa.core.title001"/>";
fixa_lang["fixa_core_title002"] = "<spring:message code="fixa.core.title002"/>";
fixa_lang["fixa_core_title003"] = "<spring:message code="fixa.core.title003"/>";
fixa_lang["fixa_core_title004"] = "<spring:message code="fixa.core.title004"/>";
fixa_lang["fixa_core_title005"] = "<spring:message code="fixa.core.title005"/>";
fixa_lang["fixa_core_title006"] = "<spring:message code="fixa.core.title006"/>";
fixa_lang["fixa_core_title006"] = "<spring:message code="fixa.core.title006"/>";
fixa_lang["fixa_core_title007"] = "<spring:message code="fixa.core.title007"/>";
fixa_lang["fixa_core_title008"] = "<spring:message code="fixa.core.title008"/>";
fixa_lang["fixa_core_title009"] = "<spring:message code="fixa.core.title009"/>";
fixa_lang["fixa_core_title010"] = "<spring:message code="fixa.core.title010"/>";
fixa_lang["fixa_core_title011"] = "<spring:message code="fixa.core.title011"/>";
fixa_lang["fixa_core_title012"] = "<spring:message code="fixa.core.title012"/>";
fixa_lang["fixa_core_title013"] = "<spring:message code="fixa.core.title013"/>";
fixa_lang["fixa_core_title014"] = "<spring:message code="fixa.core.title014"/>";
fixa_lang["fixa_core_title015"] = "<spring:message code="fixa.core.title015"/>";
fixa_lang["fixa_core_title016"] = "<spring:message code="fixa.core.title016"/>";
fixa_lang["fixa_core_title017"] = "<spring:message code="fixa.core.title017"/>";
fixa_lang["fixa_core_title018"] = "<spring:message code="fixa.core.title018"/>";
fixa_lang["fixa_core_title019"] = "<spring:message code="fixa.core.title019"/>";
fixa_lang["fixa_core_title020"] = "<spring:message code="fixa.core.title020"/>";
fixa_lang["fixa_core_title021"] = "<spring:message code="fixa.core.title021"/>";
fixa_lang["fixa_core_title022"] = "<spring:message code="fixa.core.title022"/>";
fixa_lang["fixa_core_title023"] = "<spring:message code="fixa.core.title023"/>";
fixa_lang["fixa_core_title024"] = "<spring:message code="fixa.core.title024"/>";
fixa_lang["fixa_core_title025"] = "<spring:message code="fixa.core.title025"/>";
fixa_lang["fixa_core_title026"] = "<spring:message code="fixa.core.title026"/>";
fixa_lang["fixa_core_title027"] = "<spring:message code="fixa.core.title027"/>";
fixa_lang["fixa_core_title028"] = "<spring:message code="fixa.core.title028"/>";
fixa_lang["fixa_core_title029"] = "<spring:message code="fixa.core.title029"/>";
fixa_lang["fixa_core_title030"] = "<spring:message code="fixa.core.title030"/>";
fixa_lang["fixa_core_title031"] = "<spring:message code="fixa.core.title031"/>";
fixa_lang["fixa_core_title032"] = "<spring:message code="fixa.core.title032"/>";
fixa_lang["fixa_core_title033"] = "<spring:message code="fixa.core.title033"/>";
fixa_lang["fixa_core_title034"] = "<spring:message code="fixa.core.title034"/>";
fixa_lang["fixa_core_title035"] = "<spring:message code="fixa.core.title035"/>";
fixa_lang["fixa_core_title036"] = "<spring:message code="fixa.core.title036"/>";
fixa_lang["fixa_core_title037"] = "<spring:message code="fixa.core.title037"/>";
fixa_lang["fixa_core_title038"] = "<spring:message code="fixa.core.title038"/>";
fixa_lang["fixa_core_title039"] = "<spring:message code="fixa.core.title039"/>";
fixa_lang["fixa_core_title040"] = "<spring:message code="fixa.core.title040"/>";
fixa_lang["fixa_core_title041"] = "<spring:message code="fixa.core.title041"/>";
fixa_lang["fixa_core_title042"] = "<spring:message code="fixa.core.title042"/>";
fixa_lang["fixa_core_title043"] = "<spring:message code="fixa.core.title043"/>";
fixa_lang["fixa_core_title044"] = "<spring:message code="fixa.core.title044"/>";
fixa_lang["fixa_core_title045"] = "<spring:message code="fixa.core.title045"/>";
fixa_lang["fixa_core_title046"] = "<spring:message code="fixa.core.title046"/>";
fixa_lang["fixa_core_title047"] = "<spring:message code="fixa.core.title047"/>";
fixa_lang["fixa_core_title048"] = "<spring:message code="fixa.core.title048"/>";
fixa_lang["fixa_core_title049"] = "<spring:message code="fixa.core.title049"/>";
fixa_lang["fixa_core_title050"] = "<spring:message code="fixa.core.title050"/>";
fixa_lang["fixa_core_title051"] = "<spring:message code="fixa.core.title051"/>";
fixa_lang["fixa_core_title052"] = "<spring:message code="fixa.core.title052"/>";
fixa_lang["fixa_core_title053"] = "<spring:message code="fixa.core.title053"/>";
fixa_lang["fixa_core_title054"] = "<spring:message code="fixa.core.title054"/>";
fixa_lang["fixa_core_title055"] = "<spring:message code="fixa.core.title055"/>";
fixa_lang["fixa_core_title056"] = "<spring:message code="fixa.core.title056"/>";
fixa_lang["fixa_core_title057"] = "<spring:message code="fixa.core.title057"/>";
fixa_lang["fixa_core_title058"] = "<spring:message code="fixa.core.title058"/>";
fixa_lang["fixa_core_title059"] = "<spring:message code="fixa.core.title059"/>";
fixa_lang["fixa_core_title060"] = "<spring:message code="fixa.core.title060"/>";
fixa_lang["fixa_core_title061"] = "<spring:message code="fixa.core.title061"/>";
fixa_lang["fixa_core_title062"] = "<spring:message code="fixa.core.title062"/>";
fixa_lang["fixa_core_title063"] = "<spring:message code="fixa.core.title063"/>";
fixa_lang["fixa_core_title064"] = "<spring:message code="fixa.core.title064"/>";
fixa_lang["fixa_core_title065"] = "<spring:message code="fixa.core.title065"/>";
fixa_lang["fixa_core_title066"] = "<spring:message code="fixa.core.title066"/>";
fixa_lang["fixa_core_title067"] = "<spring:message code="fixa.core.title067"/>";
fixa_lang["fixa_core_title068"] = "<spring:message code="fixa.core.title068"/>";
fixa_lang["fixa_core_title069"] = "<spring:message code="fixa.core.title069"/>";
fixa_lang["fixa_core_title070"] = "<spring:message code="fixa.core.title070"/>";
fixa_lang["fixa_core_title071"] = "<spring:message code="fixa.core.title071"/>";
fixa_lang["fixa_core_title072"] = "<spring:message code="fixa.core.title072"/>";
fixa_lang["fixa_core_title073"] = "<spring:message code="fixa.core.title073"/>";
fixa_lang["fixa_core_title074"] = "<spring:message code="fixa.core.title074"/>";
fixa_lang["fixa_core_title075"] = "<spring:message code="fixa.core.title075"/>";
fixa_lang["fixa_core_title076"] = "<spring:message code="fixa.core.title076"/>";
fixa_lang["fixa_core_title077"] = "<spring:message code="fixa.core.title077"/>";
fixa_lang["fixa_core_title078"] = "<spring:message code="fixa.core.title078"/>";
fixa_lang["fixa_core_title079"] = "<spring:message code="fixa.core.title079"/>";
fixa_lang["fixa_core_title080"] = "<spring:message code="fixa.core.title080"/>";
fixa_lang["fixa_core_title081"] = "<spring:message code="fixa.core.title081"/>";
fixa_lang["fixa_core_title082"] = "<spring:message code="fixa.core.title082"/>";
fixa_lang["fixa_core_title083"] = "<spring:message code="fixa.core.title083"/>";
fixa_lang["fixa_core_title084"] = "<spring:message code="fixa.core.title084"/>";
fixa_lang["fixa_core_title085"] = "<spring:message code="fixa.core.title085"/>";
fixa_lang["fixa_core_title086"] = "<spring:message code="fixa.core.title086"/>";
fixa_lang["fixa_core_title087"] = "<spring:message code="fixa.core.title087"/>";
fixa_lang["fixa_core_title088"] = "<spring:message code="fixa.core.title088"/>";
fixa_lang["fixa_core_title089"] = "<spring:message code="fixa.core.title089"/>";


fixa_lang["fixa_core_title090"] = "<spring:message code="fixa.core.title090"/>";
fixa_lang["fixa_core_title091"] = "<spring:message code="fixa.core.title091"/>";
fixa_lang["fixa_core_title092"] = "<spring:message code="fixa.core.title092"/>";
fixa_lang["fixa_core_title093"] = "<spring:message code="fixa.core.title093"/>";
fixa_lang["fixa_core_title094"] = "<spring:message code="fixa.core.title094"/>";
fixa_lang["fixa_core_title095"] = "<spring:message code="fixa.core.title095"/>";
fixa_lang["fixa_core_title096"] = "<spring:message code="fixa.core.title096"/>";
fixa_lang["fixa_core_title097"] = "<spring:message code="fixa.core.title097"/>";
fixa_lang["fixa_core_title098"] = "<spring:message code="fixa.core.title098"/>";
fixa_lang["fixa_core_title099"] = "<spring:message code="fixa.core.title099"/>";
fixa_lang["fixa_core_title100"] = "<spring:message code="fixa.core.title100"/>";
fixa_lang["fixa_core_title101"] = "<spring:message code="fixa.core.title101"/>";
fixa_lang["fixa_core_title102"] = "<spring:message code="fixa.core.title102"/>";

fixa_lang["fixa_core_title103"] = "<spring:message code="fixa.core.title103"/>";
fixa_lang["fixa_core_title104"] = "<spring:message code="fixa.core.title104"/>";
fixa_lang["fixa_core_title105"] = "<spring:message code="fixa.core.title105"/>";
fixa_lang["fixa_core_title106"] = "<spring:message code="fixa.core.title106"/>";
fixa_lang["fixa_core_title107"] = "<spring:message code="fixa.core.title107"/>";
fixa_lang["fixa_core_title108"] = "<spring:message code="fixa.core.title108"/>";
fixa_lang["fixa_core_title109"] = "<spring:message code="fixa.core.title109"/>";

fixa_lang["fixa_core_title110"] = "<spring:message code="fixa.core.title110"/>";
fixa_lang["fixa_core_title111"] = "<spring:message code="fixa.core.title111"/>";
fixa_lang["fixa_core_title112"] = "<spring:message code="fixa.core.title112"/>";
fixa_lang["fixa_core_title113"] = "<spring:message code="fixa.core.title113"/>";
fixa_lang["fixa_core_title114"] = "<spring:message code="fixa.core.title114"/>";
fixa_lang["fixa_core_title115"] = "<spring:message code="fixa.core.title115"/>";
fixa_lang["fixa_core_title116"] = "<spring:message code="fixa.core.title116"/>";
fixa_lang["fixa_core_title117"] = "<spring:message code="fixa.core.title117"/>";
fixa_lang["fixa_core_title118"] = "<spring:message code="fixa.core.title118"/>";
fixa_lang["fixa_core_title119"] = "<spring:message code="fixa.core.title119"/>";
fixa_lang["fixa_core_title120"] = "<spring:message code="fixa.core.title120"/>";
fixa_lang["fixa_core_title121"] = "<spring:message code="fixa.core.title121"/>";

fixa_lang["fixa_core_title122"] = "<spring:message code="fixa.core.title122"/>";
fixa_lang["fixa_core_title123"] = "<spring:message code="fixa.core.title123"/>";
fixa_lang["fixa_core_title124"] = "<spring:message code="fixa.core.title124"/>";
fixa_lang["fixa_core_title125"] = "<spring:message code="fixa.core.title125"/>";
fixa_lang["fixa_core_title126"] = "<spring:message code="fixa.core.title126"/>";
fixa_lang["fixa_core_title127"] = "<spring:message code="fixa.core.title127"/>";

fixa_lang["fixa_core_title128"] = "<spring:message code="fixa.core.title128"/>";
fixa_lang["fixa_core_title129"] = "<spring:message code="fixa.core.title129"/>";
fixa_lang["fixa_core_title130"] = "<spring:message code="fixa.core.title130"/>";


fixa_lang["fixa_core_title133"] = "<spring:message code="fixa.core.title133"/>";
fixa_lang["fixa_core_title134"] = "<spring:message code="fixa.core.title134"/>";
fixa_lang["fixa_core_title135"] = "<spring:message code="fixa.core.title135"/>";
fixa_lang["fixa_core_title136"] = "<spring:message code="fixa.core.title136"/>";
fixa_lang["fixa_core_title137"] = "<spring:message code="fixa.core.title137"/>";
fixa_lang["fixa_core_title138"] = "<spring:message code="fixa.core.title138"/>";
fixa_lang["fixa_core_title139"] = "<spring:message code="fixa.core.title139"/>";
fixa_lang["fixa_core_title140"] = "<spring:message code="fixa.core.title140"/>";
fixa_lang["fixa_core_title141"] = "<spring:message code="fixa.core.title141"/>";
fixa_lang["fixa_core_title142"] = "<spring:message code="fixa.core.title142"/>";
fixa_lang["fixa_core_title143"] = "<spring:message code="fixa.core.title143"/>";
fixa_lang["fixa_core_title144"] = "<spring:message code="fixa.core.title144"/>";
fixa_lang["fixa_core_title145"] = "<spring:message code="fixa.core.title145"/>";
fixa_lang["fixa_core_title146"] = "<spring:message code="fixa.core.title146"/>";
fixa_lang["fixa_core_title147"] = "<spring:message code="fixa.core.title147"/>";
fixa_lang["fixa_core_title148"] = "<spring:message code="fixa.core.title148"/>";
fixa_lang["fixa_core_title149"] = "<spring:message code="fixa.core.title149"/>";
fixa_lang["fixa_core_title150"] = "<spring:message code="fixa.core.title150"/>";
fixa_lang["fixa_core_title151"] = "<spring:message code="fixa.core.title151"/>";

//룰셋
fixa_lang["fixa_core_title152"] = "<spring:message code="fixa.core.title152"/>";
fixa_lang["fixa_core_title153"] = "<spring:message code="fixa.core.title153"/>";
fixa_lang["fixa_prep_title006"] = "<spring:message code="fixa.prep.title006"/>";

fixa_lang["fixa_core_title154"] = "<spring:message code="fixa.core.title154"/>";
fixa_lang["fixa_core_title155"] = "<spring:message code="fixa.core.title155"/>";
fixa_lang["fixa_core_title156"] = "<spring:message code="fixa.core.title156"/>";
fixa_lang["fixa_core_title157"] = "<spring:message code="fixa.core.title157"/>";
fixa_lang["fixa_core_title158"] = "<spring:message code="fixa.core.title158"/>";
fixa_lang["fixa_core_title159"] = "<spring:message code="fixa.core.title159"/>";
fixa_lang["fixa_core_title160"] = "<spring:message code="fixa.core.title160"/>";

fixa_lang["fixa_core_title161"] = "<spring:message code="fixa.core.title161"/>";
fixa_lang["fixa_core_title162"] = "<spring:message code="fixa.core.title162"/>";
fixa_lang["fixa_core_title163"] = "<spring:message code="fixa.core.title163"/>";
fixa_lang["fixa_core_title164"] = "<spring:message code="fixa.core.title164"/>";
fixa_lang["fixa_core_title165"] = "<spring:message code="fixa.core.title165"/>";
fixa_lang["fixa_core_title166"] = "<spring:message code="fixa.core.title166"/>";
fixa_lang["fixa_core_title167"] = "<spring:message code="fixa.core.title167"/>";
fixa_lang["fixa_core_title168"] = "<spring:message code="fixa.core.title168"/>";
fixa_lang["fixa_core_title169"] = "<spring:message code="fixa.core.title169"/>";
fixa_lang["fixa_core_title170"] = "<spring:message code="fixa.core.title170"/>";
fixa_lang["fixa_core_title171"] = "<spring:message code="fixa.core.title171"/>";
fixa_lang["fixa_core_title172"] = "<spring:message code="fixa.core.title172"/>";
fixa_lang["fixa_core_title173"] = "<spring:message code="fixa.core.title173"/>";
fixa_lang["fixa_core_title174"] = "<spring:message code="fixa.core.title174"/>";
fixa_lang["fixa_core_title175"] = "<spring:message code="fixa.core.title175"/>";
fixa_lang["fixa_core_title176"] = "<spring:message code="fixa.core.title176"/>";
fixa_lang["fixa_core_title177"] = "<spring:message code="fixa.core.title177"/>";
fixa_lang["fixa_core_title178"] = "<spring:message code="fixa.core.title178"/>";
fixa_lang["fixa_core_title179"] = "<spring:message code="fixa.core.title179"/>";
fixa_lang["fixa_core_title180"] = "<spring:message code="fixa.core.title180"/>";
fixa_lang["fixa_core_title181"] = "<spring:message code="fixa.core.title181"/>";
fixa_lang["fixa_core_title182"] = "<spring:message code="fixa.core.title182"/>";
fixa_lang["fixa_core_title183"] = "<spring:message code="fixa.core.title183"/>";
fixa_lang["fixa_core_title184"] = "<spring:message code="fixa.core.title184"/>";
fixa_lang["fixa_core_title185"] = "<spring:message code="fixa.core.title185"/>";
fixa_lang["fixa_core_title186"] = "<spring:message code="fixa.core.title186"/>";
fixa_lang["fixa_core_title187"] = "<spring:message code="fixa.core.title187"/>";
fixa_lang["fixa_core_title188"] = "<spring:message code="fixa.core.title188"/>";
fixa_lang["fixa_core_title189"] = "<spring:message code="fixa.core.title189"/>";
fixa_lang["fixa_core_title190"] = "<spring:message code="fixa.core.title190"/>";
fixa_lang["fixa_core_title191"] = "<spring:message code="fixa.core.title191"/>";
fixa_lang["fixa_core_title192"] = "<spring:message code="fixa.core.title192"/>";
fixa_lang["fixa_core_title193"] = "<spring:message code="fixa.core.title193"/>";
fixa_lang["fixa_core_title194"] = "<spring:message code="fixa.core.title194"/>";
fixa_lang["fixa_core_title195"] = "<spring:message code="fixa.core.title195"/>";
fixa_lang["fixa_core_title196"] = "<spring:message code="fixa.core.title196"/>";
fixa_lang["fixa_core_title197"] = "<spring:message code="fixa.core.title197"/>";
fixa_lang["fixa_core_title198"] = "<spring:message code="fixa.core.title198"/>";

fixa_lang["fixa_core_title199"] = "<spring:message code="fixa.core.title199"/>";
fixa_lang["fixa_core_title200"] = "<spring:message code="fixa.core.title200"/>";
fixa_lang["fixa_core_title201"] = "<spring:message code="fixa.core.title201"/>";
fixa_lang["fixa_core_title202"] = "<spring:message code="fixa.core.title202"/>";
fixa_lang["fixa_core_title203"] = "<spring:message code="fixa.core.title203"/>";
fixa_lang["fixa_core_title204"] = "<spring:message code="fixa.core.title204"/>";
fixa_lang["fixa_core_title205"] = "<spring:message code="fixa.core.title205"/>";
fixa_lang["fixa_core_title206"] = "<spring:message code="fixa.core.title206"/>";
fixa_lang["fixa_core_title207"] = "<spring:message code="fixa.core.title207"/>";
fixa_lang["fixa_core_title208"] = "<spring:message code="fixa.core.title208"/>";
fixa_lang["fixa_core_title209"] = "<spring:message code="fixa.core.title209"/>";
fixa_lang["fixa_core_title210"] = "<spring:message code="fixa.core.title210"/>";
fixa_lang["fixa_core_title211"] = "<spring:message code="fixa.core.title211"/>";
fixa_lang["fixa_core_title212"] = "<spring:message code="fixa.core.title212"/>";
fixa_lang["fixa_core_title213"] = "<spring:message code="fixa.core.title213"/>";
fixa_lang["fixa_core_title214"] = "<spring:message code="fixa.core.title214"/>";
fixa_lang["fixa_core_title215"] = "<spring:message code="fixa.core.title215"/>";
fixa_lang["fixa_core_title216"] = "<spring:message code="fixa.core.title216"/>";
fixa_lang["fixa_core_title217"] = "<spring:message code="fixa.core.title217"/>";
fixa_lang["fixa_core_title218"] = "<spring:message code="fixa.core.title218"/>";
fixa_lang["fixa_core_title219"] = "<spring:message code="fixa.core.title219"/>";
fixa_lang["fixa_core_title220"] = "<spring:message code="fixa.core.title220"/>";
fixa_lang["fixa_core_title221"] = "<spring:message code="fixa.core.title221"/>";
fixa_lang["fixa_core_title222"] = "<spring:message code="fixa.core.title222"/>";
fixa_lang["fixa_core_title223"] = "<spring:message code="fixa.core.title223"/>";
fixa_lang["fixa_core_title224"] = "<spring:message code="fixa.core.title224"/>";
fixa_lang["fixa_core_title225"] = "<spring:message code="fixa.core.title225"/>";
fixa_lang["fixa_core_title226"] = "<spring:message code="fixa.core.title226"/>";
fixa_lang["fixa_core_title227"] = "<spring:message code="fixa.core.title227"/>";
fixa_lang["fixa_core_title228"] = "<spring:message code="fixa.core.title228"/>";
fixa_lang["fixa_core_title229"] = "<spring:message code="fixa.core.title229"/>";
fixa_lang["fixa_core_title230"] = "<spring:message code="fixa.core.title230"/>";
fixa_lang["fixa_core_title231"] = "<spring:message code="fixa.core.title231"/>";
fixa_lang["fixa_core_title231"] = "<spring:message code="fixa.core.title232"/>";
fixa_lang["fixa_core_title233"] = "<spring:message code="fixa.core.title233"/>";
fixa_lang["fixa_core_title234"] = "<spring:message code="fixa.core.title234"/>";
fixa_lang["fixa_core_title235"] = "<spring:message code="fixa.core.title235"/>";
fixa_lang["fixa_core_title236"] = "<spring:message code="fixa.core.title236"/>";
fixa_lang["fixa_core_title237"] = "<spring:message code="fixa.core.title237"/>";
fixa_lang["fixa_core_title238"] = "<spring:message code="fixa.core.title238"/>";
fixa_lang["fixa_core_title239"] = "<spring:message code="fixa.core.title239"/>";
fixa_lang["fixa_core_title240"] = "<spring:message code="fixa.core.title240"/>";
fixa_lang["fixa_core_title241"] = "<spring:message code="fixa.core.title241"/>";
fixa_lang["fixa_core_title242"] = "<spring:message code="fixa.core.title242"/>";
fixa_lang["fixa_core_title243"] = "<spring:message code="fixa.core.title243"/>";
fixa_lang["fixa_core_title244"] = "<spring:message code="fixa.core.title244"/>";

fixa_lang["fixa_stat_title001"] = "<spring:message code="fixa.stat.title001"/>";
fixa_lang["fixa_datainput_title12"] = "<spring:message code="fixa.datainput.title12"/>";

fixa_lang["fixa_scheduling_title001"] = "<spring:message code="fixa.scheduling.title001"/>";
fixa_lang["fixa_scheduling_title002"] = "<spring:message code="fixa.scheduling.title002"/>";
fixa_lang["fixa_scheduling_title003"] = "<spring:message code="fixa.scheduling.title003"/>";
fixa_lang["fixa_scheduling_title004"] = "<spring:message code="fixa.scheduling.title004"/>";
fixa_lang["fixa_scheduling_title005"] = "<spring:message code="fixa.scheduling.title005"/>";
fixa_lang["fixa_scheduling_title006"] = "<spring:message code="fixa.scheduling.title006"/>";
fixa_lang["fixa_scheduling_title007"] = "<spring:message code="fixa.scheduling.title007"/>";
fixa_lang["fixa_scheduling_title008"] = "<spring:message code="fixa.scheduling.title008"/>";
fixa_lang["fixa_scheduling_title009"] = "<spring:message code="fixa.scheduling.title009"/>";
fixa_lang["fixa_scheduling_title010"] = "<spring:message code="fixa.scheduling.title010"/>";
fixa_lang["fixa_scheduling_title011"] = "<spring:message code="fixa.scheduling.title011"/>";
fixa_lang["fixa_scheduling_title012"] = "<spring:message code="fixa.scheduling.title012"/>";
fixa_lang["fixa_scheduling_title013"] = "<spring:message code="fixa.scheduling.title013"/>";
fixa_lang["fixa_scheduling_title014"] = "<spring:message code="fixa.scheduling.title014"/>";
fixa_lang["fixa_scheduling_title015"] = "<spring:message code="fixa.scheduling.title015"/>";
fixa_lang["fixa_scheduling_title016"] = "<spring:message code="fixa.scheduling.title016"/>";
fixa_lang["fixa_scheduling_title017"] = "<spring:message code="fixa.scheduling.title017"/>";
fixa_lang["fixa_scheduling_title018"] = "<spring:message code="fixa.scheduling.title018"/>";
fixa_lang["fixa_scheduling_title019"] = "<spring:message code="fixa.scheduling.title019"/>";
fixa_lang["fixa_scheduling_title020"] = "<spring:message code="fixa.scheduling.title020"/>";
fixa_lang["fixa_scheduling_title021"] = "<spring:message code="fixa.scheduling.title021"/>";
fixa_lang["fixa_scheduling_title022"] = "<spring:message code="fixa.scheduling.title022"/>";
fixa_lang["fixa_scheduling_title023"] = "<spring:message code="fixa.scheduling.title023"/>";
fixa_lang["fixa_scheduling_title024"] = "<spring:message code="fixa.scheduling.title024"/>";
fixa_lang["fixa_scheduling_title025"] = "<spring:message code="fixa.scheduling.title025"/>";
fixa_lang["fixa_scheduling_title026"] = "<spring:message code="fixa.scheduling.title026"/>";
fixa_lang["fixa_scheduling_title027"] = "<spring:message code="fixa.scheduling.title027"/>";
fixa_lang["fixa_scheduling_title028"] = "<spring:message code="fixa.scheduling.title028"/>";
fixa_lang["fixa_scheduling_title029"] = "<spring:message code="fixa.scheduling.title029"/>";
fixa_lang["fixa_scheduling_title032"] = "<spring:message code="fixa.scheduling.title032"/>";
fixa_lang["fixa_scheduling_title033"] = "<spring:message code="fixa.scheduling.title033"/>";
fixa_lang["fixa_scheduling_title034"] = "<spring:message code="fixa.scheduling.title034"/>";
fixa_lang["fixa_scheduling_title035"] = "<spring:message code="fixa.scheduling.title035"/>";
fixa_lang["fixa_scheduling_title040"] = "<spring:message code="fixa.scheduling.title040"/>";
fixa_lang["fixa_scheduling_title041"] = "<spring:message code="fixa.scheduling.title041"/>";
fixa_lang["fixa_scheduling_title042"] = "<spring:message code="fixa.scheduling.title042"/>";

fixa_lang["fixa_common_date1"] = "<spring:message code="fixa.common.date1"/>";
fixa_lang["fixa_common_date2"] = "<spring:message code="fixa.common.date2"/>";
fixa_lang["fixa_common_date3"] = "<spring:message code="fixa.common.date3"/>";
fixa_lang["fixa_common_date4"] = "<spring:message code="fixa.common.date4"/>";
fixa_lang["fixa_common_date5"] = "<spring:message code="fixa.common.date5"/>";
fixa_lang["fixa_common_date6"] = "<spring:message code="fixa.common.date6"/>";
fixa_lang["fixa_common_date7"] = "<spring:message code="fixa.common.date7"/>";
fixa_lang["fixa_common_date8"] = "<spring:message code="fixa.common.date8"/>";
fixa_lang["fixa_common_date9"] = "<spring:message code="fixa.common.date9"/>";
fixa_lang["fixa_common_date10"] = "<spring:message code="fixa.common.date10"/>";
fixa_lang["fixa_common_date11"] = "<spring:message code="fixa.common.date11"/>";
fixa_lang["fixa_common_date12"] = "<spring:message code="fixa.common.date12"/>";
fixa_lang["fixa_common_date13"] = "<spring:message code="fixa.common.date13"/>";
fixa_lang["fixa_common_date14"] = "<spring:message code="fixa.common.date14"/>";
fixa_lang["fixa_common_date15"] = "<spring:message code="fixa.common.date15"/>";
fixa_lang["fixa_common_date16"] = "<spring:message code="fixa.common.date16"/>";
fixa_lang["fixa_common_date17"] = "<spring:message code="fixa.common.date17"/>";
fixa_lang["fixa_common_date18"] = "<spring:message code="fixa.common.date18"/>";
fixa_lang["fixa_common_date19"] = "<spring:message code="fixa.common.date19"/>";
fixa_lang["fixa_common_date20"] = "<spring:message code="fixa.common.date20"/>";
fixa_lang["fixa_common_date21"] = "<spring:message code="fixa.common.date21"/>";
fixa_lang["fixa_common_date22"] = "<spring:message code="fixa.common.date22"/>";
fixa_lang["fixa_common_date23"] = "<spring:message code="fixa.common.date23"/>";
fixa_lang["fixa_common_date24"] = "<spring:message code="fixa.common.date24"/>";
fixa_lang["fixa_common_date25"] = "<spring:message code="fixa.common.date25"/>";
fixa_lang["fixa_common_date26"] = "<spring:message code="fixa.common.date26"/>";
</script>


