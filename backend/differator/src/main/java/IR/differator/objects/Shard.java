package IR.differator.objects;

public class Shard implements Comparable<Shard>{
    private String name;
    private int numDocs;

    public Shard(String name, int numDocs) {
        this.name = name;
        this.numDocs = numDocs;
    }

    public String getName() {
        return name;
    }

    public int getNumDocs() {
        return numDocs;
    }

    @Override
    public int compareTo(Shard o) {
        int thisShardId = Integer.parseInt(name.replaceAll("\\D+", ""));
        int otherShardId = Integer.parseInt(o.name.replaceAll("\\D+", ""));
        return thisShardId - otherShardId;
    }
}
