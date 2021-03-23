package fixadata.util;

import com.mashape.unirest.http.Unirest;

public class UtilSingleThread implements Runnable{
private String jsonData;	
   
    public UtilSingleThread(String jsonData){
    	this.jsonData = jsonData;
    }
	
    @Override
    public void run() {
	// TODO Auto-generated method stub
    	try {
    		sendREST(jsonData);
    	}catch(Exception e) {
    		
    	}
    }
    public void sendREST(String jsonData)throws Exception {

    	String url = "http://localhost:9997/release";
    	Unirest.post(url).body(jsonData).asString();
    }
}
