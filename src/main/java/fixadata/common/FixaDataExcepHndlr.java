package fixadata.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import egovframework.rte.fdl.cmmn.exception.handler.ExceptionHandler;

public class FixaDataExcepHndlr implements ExceptionHandler {

	private static final Logger LOGGER = LoggerFactory.getLogger(FixaDataExcepHndlr.class);

	@Override
	public void occur(Exception ex, String packageName) {
		LOGGER.debug("EgovServiceExceptionHandler run...............");
	}
}
