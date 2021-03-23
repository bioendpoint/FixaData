package fixadata.init;

import org.apache.commons.dbcp.BasicDataSource;

public class init extends BasicDataSource{
	@Override
	public void setUrl(String url)
	{

		super.setUrl(url);
	}
}
