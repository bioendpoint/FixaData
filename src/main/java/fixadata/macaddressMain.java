
package fixadata;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;

import fixadata.util.UtilCommon;

public class macaddressMain {
	public static void main(String[] args) throws SocketException, UnknownHostException
	{
		 	System.out.println(UtilCommon.getMacAddress());
	}
	
}
