package IR.differator.objects;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class Interval implements Comparable<Interval> {
    private Date startDate;
    private Date endDate;

    private String strStartDate;
    private String strEndDate;

    private int numDocs;

    public Interval(Date startDate, Date endDate, String strStartDate, String strEndDate, int numDocs) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.strStartDate =strStartDate;
        this.strEndDate = strEndDate;
        this.numDocs = numDocs;
    }

    public int getNumDocs() {
        return numDocs;
    }

    public String getIntervalAsString(){
        return String.format("[%s TO %s]", strStartDate, strEndDate);
    }

    @Override
    public int compareTo(Interval o) {
        return startDate.compareTo(o.startDate);
    }
}
