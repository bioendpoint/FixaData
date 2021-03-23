<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>

<!DOCTYPE html>
<html lang="en">

<head>

  <title>fixaData 2.0</title>

  <script src="/fixadata-common/plugin/slickgrid/jquery-1.7.min.js"></script>
  <link type="image/x-icon"	rel="icon"			href="/fixadata-common/images/simbol-16x16-v1.01.png">
  <link type="image/x-icon"	rel="shortcut icon"	href="/fixadata-common/images/simbol-16x16-v1.01.png">
  
  <!-- Custom fonts for this template-->
  <link href="/fixadata-common/vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

  <!-- Custom styles for this template-->
  <link href="/fixadata-common/css/sb-admin-2.min.css" rel="stylesheet">
  
  <!-- head -->
  <!-- 	 -->
  <link rel="stylesheet" href="/fixadata-common/plugin/slickgrid/slick.grid.css" type="text/css"/>
   
  
  <link rel="stylesheet" href="/fixadata-common/plugin/slickgrid/slick-default-theme.css" type="text/css"/> 
  <link rel="stylesheet" href="/fixadata-common/plugin/slickgrid/examples.css" type="text/css"/>
  
  <script src="/fixadata-common/plugin/slickgrid/jquery.event.drag-2.2.js"></script>
  <script src="/fixadata-common/plugin/slickgrid/slick.core.js"></script>
  <script src="/fixadata-common/plugin/slickgrid/slick.grid.js"></script>
  <script src="/fixadata-common/plugin/slickgrid/slick.dataview.js"></script>
  <script src="/fixadata-common/plugin/slickgrid/slick.formatters.js"></script>
  <script src="/fixadata-common/plugin/slickgrid/slick.editors.js"></script>
  <script src="/fixadata-common/plugin/slickgrid/slick.grid.js"></script>
  <script src="/fixadata-common/plugin/jqueryui/jquery-ui.js"></script>
  
  <script src="/fixadata-common/common.js"></script>
  <script src="/fixadata-common/member.js"></script>
  <script src="/fixadata-common/collect.js"></script>  
  <script src="/fixadata-common/outlier.js"></script>
  
  
  <script type="text/javascript">
		var cur_project_data = "${session_project_data_sn }";
		
		function link(page) 
		{
			var url = "";
			 
			if(page=="logout")
			{
				if(confirm('<spring:message code="fixa.header.title001"/>'))
				{
					url = "/fixadata/sessionOut.fd";
					location.href  = url;
				}
			}
			else if(page=="ruleset")
			{
				window.open("/fixadata/ruleadmin.fd", "rulset", "width=1544, height=500, left=100, top=230");
				//url = "/fixadata/ruleadmin.fd";
				//location.href  = url;
			}
			else if(page=="collect")
			{
				url = "/collect/datainput.fd";
				location.href  = url;
			}
			else if(cur_project_data=="")
			{
				if(page=="prep" || page=="workflow" || page=="statistics")
				{
					alert('<spring:message code="fixa.header.title002"/>');
					return ;
				}
			}
			else
			{
				if(page=="prep")
				{
					url = "/prep/prep.fd";		
				}
				
				else if(page=="workflow")
				{
					url = "/outlier/workflow.fd";
				}
				else if(page=="statistics")
				{
					url = "/outlier/workflow.fd";
				}
				else if(page=="collect")
				{
					url = "/collect/datainput.fd";
				}
				location.href  = url;
			}
		}
	</script>
</head>

<body id="page-top">

  <!-- Page Wrapper -->
  <div id="wrapper">

    <!-- Content Wrapper -->
    <div id="content-wrapper" class="d-flex flex-column">

      <!-- Main Content -->
      <div id="content">
		
        <!-- Topbar -->
        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

        <!-- 상단 메뉴  -->	
  		<a href='#' onClick="link('collect')">collect</a>
  	 		<div class="topbar-divider d-none d-sm-block"></div>
  		<a href='#' onClick="link('prep')">prep</a>
  			<div class="topbar-divider d-none d-sm-block"></div>
  		<a href='#' onClick="link('workflow')">workflow</a>
  		 	<div class="topbar-divider d-none d-sm-block"></div>
  		<a href='#' onClick="link('statistics')">statistics</a>
  		 	<div class="topbar-divider d-none d-sm-block"></div>
  		<a href='#' onClick="link('ruleset')">ruleset confiuation</a>
  		<!--// 상단 메뉴  -->	

          <!-- Topbar Navbar -->
          <ul class="navbar-nav ml-auto">
             <!-- Nav Item - User Information -->
            <li class="nav-item dropdown no-arrow">
              <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="mr-2 d-none d-lg-inline text-gray-600 small">${session}님 로그인</span>
                <img class="img-profile rounded-circle" src="/fixadata-common/images/kaka5.jfif">
              </a>
            </li>

            <div class="topbar-divider d-none d-sm-block"></div>
            
            <!-- Nav Item - Messages -->
            <li class="nav-item dropdown no-arrow mx-1">
              <a class="nav-link dropdown-toggle" href="#" data-target="#logoutModal" data-toggle="modal"  id="messagesDropdown" role="button" >
               <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                  Logout
              </a>
            </li>

          </ul>

        </nav>
        <!-- End of Topbar -->

  <!-- Scroll to Top Button-->
  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>

  <!-- Logout Modal-->
  <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">로그아웃 하시겠습니까 ?</h5>
          <button class="close" type="button" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="modal-body"><spring:message code="fixa.header.title003"/></div>
        <div class="modal-footer">
          <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
          <a class="btn btn-primary" href="/fixadata/sessionOut.fd">Logout</a>
        </div>
      </div>
    </div>
  </div>

  <!-- Bootstrap core JavaScript-->
  <script src="/fixadata-common/vendor/jquery/jquery.min.js"></script>
  <script src="/fixadata-common/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

  <!-- Core plugin JavaScript-->
  <script src="/fixadata-common/vendor/jquery-easing/jquery.easing.min.js"></script>

  <!-- Custom scripts for all pages-->
  <script src="/fixadata-common/js/sb-admin-2.min.js"></script>