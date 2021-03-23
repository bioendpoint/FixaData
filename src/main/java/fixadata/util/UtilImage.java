package fixadata.util;

import java.awt.Graphics;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import javax.imageio.ImageIO;

public class UtilImage {
	/**
	 * width기준으로 수정
	 * @param mp
	 * @param width
	 * @param savepath 저장 위치
	 * @param ext 확장자
	 * @throws IOException
	 */
	public static void saveImage(InputStream is, int width, File destinationFile, String ext) throws IOException
	{

		int w = 0;
		int h = 0;

		w = width;

		BufferedImage image = ImageIO.read(is);

		if(image.getWidth()>=width)
		{
			w = width;
			h = (image.getHeight()*width)/image.getWidth();
		}
		else
		{
			w = image.getWidth();
			h = image.getHeight();
		}

		Image resizeImage = image.getScaledInstance(w, h, Image.SCALE_SMOOTH);

		BufferedImage newImage = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
		Graphics g = newImage.getGraphics();
		g.drawImage(resizeImage, 0, 0, null);
		g.dispose();

		ImageIO.write(newImage, ext, destinationFile);

	}
}