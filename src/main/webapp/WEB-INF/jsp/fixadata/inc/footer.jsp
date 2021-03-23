<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
	<div id="arConsole">
			<div class="itmPanel">
				<div class="header">
					<a href="#" data-id="console" class="title on">Console</a>
					<a href="#" data-id="blockchain" class="title">Blockchain</a>
					<div class="button"><a href="#" class="minimize changeBottom"><spring:message code="fixa.footer.title001"/></a><span class="line"></span><a href="#" class="close"><spring:message code="fixa.footer.title002"/></a></div>
				</div>
				<div data-id="console" class="contents on">
					<div id="consoleText" class="content">
						<!--<span class="code">[ERR-1004]</span>콘솔 내용을 표출<br><span class="code">[ERR-1004]</span><span class="strong">중요한 내용은 색상으로 강조</span>-->
					</div>
				</div>
				<div data-id="blockchain" class="contents">
					<div id="blockchainInfo" class="info"></div>
					<div id="blockchain" class="content block"></div>
					<div class="_clear"></div>
				</div>
			</div><!--// .itmPanel -->
		</div><!--// #arConsole -->
	</div><!--// #wrContents -->


	<aside id="wrSidebar">
		<div id="arHistory">
			<div class="itmPanel">
				<div class="header">
					<div class="title history on">History</div>
					<div class="title property"><spring:message code="fixa.footer.title003"/></div>
					<div class="button"><!--a href="#" class="minimize changeRight"><spring:message code="fixa.footer.title001"/></a><span class="line">|</span--><a href="#" class="close"><spring:message code="fixa.footer.title002"/></a></div>
				</div>
				<div class="contents on" id="itmHistory">
					<div id="historyProjectName" class="item projectName"></div>
					<ul id="itmHistoryGrid" class="content itmHistory">
						<li><a href="#" class="item a now" data-id="" data-index-row="-1" data-index-col="-1" data-value-bef="" data-value-aft="" onclick="Core.History.GridClick(this);"><spring:message code="fixa.footer.title004"/></a></li>
					</ul>
					<ul id="itmHistoryDiagram" class="content itmHistory _none">
						<li><a href="#" class="item a now" data-id="" data-index-row="-1" data-index-col="-1" data-value-bef="" data-value-aft="" onclick="Core.History.DiagramClick(this);"><spring:message code="fixa.footer.title005"/></a></li>
					</ul>
				</div>
				<div class="contents" id="itmProperty"></div>
			</div><!--// .itmPanel -->
		</div><!--// #arHistory -->

		<div id="arChatbot">
			<div class="itmPanel">
				<div class="header">
					<div class="title on">Chatbot</div>
					<div class="button"><!--a href="#" class="minimize changeRight"><spring:message code="fixa.footer.title001"/></a><span class="line"></span--><a href="#" class="close"><spring:message code="fixa.footer.title002"/></a></div>
				</div>
				<div class="contents">
					<div class="content">
						<ul id="chatBot" class="text">
							<!--<li><span class="time">00:00</span><span class="message">이곳은 입력한 챗 내용이 표출 되는 부분 입니다.</span></li>-->
							<li><span class="message widthFull">[시스템] 명령 단어 또는 문장을 입력하세요.</span></li>
						</ul>
						<div class="input"><input id="inputChatBot" name="CHATBOT_INPUT" type="text" value=""><a href="#" id="btnChatBot" class="button">말풍선 버튼(입력 텍스트 전송)</a></div>
					</div>
				</div>
			</div><!--// .itmPanel -->
		</div><!--// #arChatbot -->
	</aside><!--// #wrSidebar -->
</div><!--// #wrap -->
</div></div></body>
</html>