package IR.differator.objects;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class Day implements Comparable<Day>{
    private String date;
    private int numDocs;

    public Day(String date, int numDocs){
        this.date = date;
        this.numDocs = numDocs;
    }

    public String getDate() {
        return date;
    }

    public String getNextDate() {
        try{
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
            Calendar c = Calendar.getInstance();
            c.setTime(format.parse(date));
            c.add(Calendar.DATE, 1);
            return format.format(c.getTime());
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    public int getNumDocs() {
        return numDocs;
    }

    @Override
    public int compareTo(Day o) {
        try{
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
            Date ourDate = format.parse(date);
            Date theirDate = format.parse(o.date);
            return ourDate.compareTo(theirDate);
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return 0;
    }
}
