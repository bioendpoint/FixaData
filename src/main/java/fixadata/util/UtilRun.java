
package fixadata.util;

public class UtilRun implements Runnable {

	private String[] fieldsArray;
	private String fileName;



	public UtilRun(String[] fieldsArray, String fileName) {

		this.fieldsArray = fieldsArray;
		this.fileName = fileName;
	}


	@Override
	public void run() {
		try {
			UtilExecute.py(this.fieldsArray, this.fileName);

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}