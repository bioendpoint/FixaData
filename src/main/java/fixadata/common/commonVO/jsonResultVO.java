package fixadata.common.commonVO;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import lombok.Getter;
import lombok.Setter;


public class jsonResultVO {
	/**
	 * 성공 : success
	 * 실패 : fail
	 */
	@Getter @Setter
	private String result = "fail";
	/**
	 * 실패시 실패원인에 대한 메시지
	 */
	@Getter @Setter
	private String resultMsg = "";
	/**
	 * 실데이터
	 */
	@Getter
	private List<HashMap> data;
	/**
	 * data에 대한 header 정보
	 */
	@Getter @Setter
	private ArrayList<String> header = new ArrayList<String>();

	@Getter @Setter
	private ArrayList<HashMap> header_option = new ArrayList<HashMap>();

	@Getter @Setter
	private ArrayList<HashMap> blockchain = new ArrayList<HashMap>();

	@Getter
	private int totalListCnt=0;

	public void setData(List<HashMap> data )
	{
		this.data = data;

		if(null!=data && data.size()>=0)
		{
			this.totalListCnt = data.size();

			if(this.getHeader()==null || this.getHeader().size()==0)
			{
				HashMap<String,String> m = data.get(0);

				for(String key : m.keySet())
				{
					this.header.add(key);
				}
			}
		}
	}
}