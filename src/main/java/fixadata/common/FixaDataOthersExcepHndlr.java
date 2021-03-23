package fixadata.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import egovframework.rte.fdl.cmmn.exception.handler.ExceptionHandler;

public class FixaDataOthersExcepHndlr implements ExceptionHandler {

	private static final Logger LOGGER = LoggerFactory.getLogger(FixaDataOthersExcepHndlr.class);

	@Override
	public void occur(Exception exception, String packageName) {
		LOGGER.debug(" EgovServiceExceptionHandler run...............");
	}
}
