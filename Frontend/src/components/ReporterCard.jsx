
export default function ReporterCard({ reporter }){

    if (!reporter) return null;

    const getInitials = (name = "") => {
        return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase();
    }


    return (
    <div className="card shadow-sm">
      <div className="card-body d-flex align-items-center gap-3">

        {reporter.avatarUrl ? (
          <img
            src={reporter.avatarUrl}
            alt={reporter.name}
            width={64}
            height={64}
            className="rounded-circle"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div
            className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
            style={{
              width: 64,
              height: 64,
              fontWeight: "bold",
              fontSize: "1.25rem",
            }}
          >
            {getInitials(reporter.name)}
          </div>
        )}

        <div>
          <h5 className="mb-1">{reporter.name}</h5> 
        </div>

      </div>
    </div>
  );
}