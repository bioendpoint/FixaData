package fixadata.util;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.tomcat.dbcp.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.JdbcTemplate;

import fixadata.collect.vo.dbInfoVO;
import lombok.extern.slf4j.Slf4j;


@Slf4j
public class UtilDb{

	private static BasicDataSource dataSource2 = null;
	private static JdbcTemplate jdbcTemplate = null;
	private static boolean isConnection = false;


	/**
	 * 데이터 베이스 커텍션 시도
	 * @param driver
	 * @param url
	 * @param id
	 * @param pw
	 * @throws Exception
	 */
	public void ConnectionInfo(String driver, String url, String id, String pw) throws Exception
	{

		if(driver.toLowerCase().contains("mysql") || driver.toLowerCase().contains("oracle"))
		{
			try {
				dataSource2 = new BasicDataSource();

				dataSource2.setDriverClassName(driver);
				dataSource2.setUrl(url);
				dataSource2.setUsername(id);
				dataSource2.setPassword(pw);

				// datasource 연결
				jdbcTemplate = new JdbcTemplate(dataSource2);

				isConnection = true;


			}catch(Exception e)
			{
				isConnection = false;
				log.error("####################################### start sql exception #######################################");
				log.error(e.getMessage());
				log.error("####################################### end sql exception #########################################");
			}
		} else {
			isConnection = false;
			throw new Exception("현재 재공하지 않은 드라이버 에대해서 접속을 시도하고있습니다. 현재 mysql(mariadb와 oracle에 대한 접속만 지원하고있습니다.");
		}
	}

	/**
	 * db 연결테스트
	 * @return
	 */
	public String connectionTest()
	{
		String result = "success";

		try {
			dataSource2.getConnection();
		}catch(Exception e)
		{
			isConnection = false;
			log.error(e.getMessage());
			result = e.getMessage();
		}
		return result;
	}


	/**
	 * list 쿼리
	 * @param sql
	 * @throws SQLException
	 */
	public static List<Map<String, Object>> listQuery(String sql) throws SQLException
	{
		List<Map<String, Object>> queryForList = jdbcTemplate.queryForList(sql);
		return queryForList;
	}

	/**
	 *
	 * @param sql
	 * @return
	 * @throws SQLException
	 */
	public static List<Map<String, Object>> fieldQuery(dbInfoVO vo, String table) throws SQLException
	{

		StringBuffer sb = new StringBuffer();

		if(vo.getDriver().toLowerCase().indexOf("oracle")>=0)
		{
			sb.append("SELECT * FROM COLS WHERE TABLE_NAME = ");
			//table명 입력
			sb.append("'"+table+"'");
		}
		else if(vo.getDriver().toLowerCase().indexOf("mariadb")>=0 || vo.getDriver().toLowerCase().indexOf("mysql")>=0)
		{
			sb.append("desc "+table);
		}
		else
		{
			sb.append("desc "+table);
		}

		List<Map<String, Object>> queryForList = jdbcTemplate.queryForList(sb.toString());
		return queryForList;
	}


	/**
	 * n개의 데이터 추출 기본적으로 idx값 추가 하여 반환
	 * @param vo
	 * @param sql
	 * @param limit
	 * @return
	 */
	public static List<Map<String,Object>> listQueryLimitN(dbInfoVO vo,String sql, int limit )
	{
		StringBuffer sb = new StringBuffer();
		List<Map<String, Object>> resultList = new ArrayList<Map<String,Object>>();

		if(vo.getDriver().toLowerCase().indexOf("oracle")>=0)
		{
			sb.append("select a.* from (");
			sb.append(" "+sql+" ");
			sb.append(") a where idx between 0 and "+limit);

			sql = sb.toString();

			log.debug(sb.toString());

		}
		else if(vo.getDriver().toLowerCase().indexOf("mariadb")>=0 || vo.getDriver().toLowerCase().indexOf("mysql")>=0)
		{
			sql = sql + " ";
		}
		else
		{
			sql = sql + " ";
		}
		List<Map<String, Object>> queryForList = jdbcTemplate.queryForList(sql);


		int cnt= 1;
		for(Map<String, Object> m: queryForList)
		{

			if(m.get("IDX")==null && m.get("idx")==null)
			{
				m.put("idx", cnt);
				cnt++;
			}
			else
			{
				m.put("idx", m.get("IDX"));
				//m.remove("IDX");
			}
			resultList.add(m);
		}
		//		System.out.println(queryForList);
		//		System.out.println(resultList);

		return resultList;
	}

	/**
	 * 오라클 및 mysql(maraidb)
	 * @param driver
	 * @return
	 * @throws Exception
	 */
	public static List<Map<String,Object>> databasesList(String driver) throws Exception
	{
		String sql = "";
		if(driver.toLowerCase().indexOf("oracle")>=0)
		{
			sql = "SELECT * FROM user_tables";
		}
		else if(driver.toLowerCase().indexOf("mariadb")>=0 || driver.toLowerCase().indexOf("mysql")>=0)
		{
			sql = "show tables;";
		}
		else {
			throw new Exception("현재  oracle 과 mysql(mariadb)에 대한 기능만 제공하고있습니다.");
		}
		List<Map<String, Object>> queryForList = jdbcTemplate.queryForList(sql);
		return queryForList;
	}


	/**
	 * insertQuery
	 * @param sql
	 * @throws SQLException
	 */
	public static int insertQuery(String sql) throws SQLException
	{
		return jdbcTemplate.update(sql);
	}

	/**
	 * updateQuery
	 * @param sql
	 * @throws SQLException
	 */
	public static int updateQuery(String sql) throws SQLException
	{
		return jdbcTemplate.update(sql);
	}

	public static void closeDb() throws SQLException
	{
		// datasource 종료
		dataSource2.close();
		jdbcTemplate = null;
	}


	public String generatorSelectQuery(String table, String[] field, String where , String sort)
	{

		StringBuffer sql = new StringBuffer();

		sql.append("select ");
		for(int i=0;i<field.length;i++)
		{
			if(i==0)
			{
				sql.append(""+field[i]);
			}
			else
			{
				sql.append(","+field[i]);
			}
		}

		sql.append(" from "+table);


		if(null!=where)
		{
			sql.append(" "+where);
		}

		if(null!=sort)
		{
			sql.append(" "+sort);
		}

		log.debug("generator sql:"+sql.toString());
		return sql.toString();
	}


	public static void main(String[] args) throws Exception
	{
		UtilDb db = new UtilDb();


		db.ConnectionInfo("com.mysql.jdbc.Driver","jdbc:mysql://nshare.co.kr:3306/mess?serverTimezone=Asia/Seoul","root","");
		System.out.println(db.connectionTest());


		db.insertQuery("INSERT INTO test(f1,f2)VALUES('f1','f2')");


		System.out.println(db.listQuery(db.generatorSelectQuery("test",new String[]{ "idx", "f4", "f2", "f1" },null, "ORDER BY idx DESC ")));
		//
		/**
		db.insertQuery("INSERT INTO test(f1,f2)VALUES('f1','f2')");

		db.updateQuery("update test set f1='f111' where idx = '1'");

		System.out.println("#####################################################");
		System.out.println("query Test1");
		db.listQuery("select * from i_training");
		System.out.println("#####################################################");

		System.out.println("#####################################################");
		System.out.println("query Test2");

		System.out.println("#####################################################");

		 **/
		//db.closeDb();
	}
}