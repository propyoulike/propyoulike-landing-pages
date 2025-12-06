<div
  key={i}
  className="w-full md:w-[55%] lg:w-[40%]"
>
  <div className="bg-card rounded-2xl shadow overflow-hidden">

    {/* IMAGE */}
    <div className="aspect-video overflow-hidden">
      <img
        src={tower.image}
        alt={tower.name}
        className="w-full h-full object-cover"
      />
    </div>

    {/* CONTENT */}
    <div className="p-6">

      {/* HEADER */}
      <button
        onClick={() => setExpanded(isOpen ? null : i)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-3">
          <Building2 className="text-primary w-7 h-7" />
          <h3 className="text-xl font-bold">{tower.name}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="text-primary" />
        ) : (
          <ChevronDown className="text-primary" />
        )}
      </button>

      {/* BODY — OUTSIDE FLEX (KEY FIX) */}
      <div className="w-full">
      {isOpen && (
        <div className="mt-6 space-y-8 text-sm w-full">

          {/* STATUS */}
          {tower.status?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-1">Current Status</h4>
              <ul className="list-disc pl-5 space-y-1">
                {tower.status.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ACHIEVED */}
          {tower.achieved?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-1 flex items-center gap-2">
                <CheckCircle2 className="text-green-500 w-4 h-4" />
                Achieved Milestones
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                {tower.achieved.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {/* UPCOMING */}
          {tower.upcoming?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-1 flex items-center gap-2">
                <Clock className="text-orange-500 w-4 h-4" />
                Upcoming Milestones
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                {tower.upcoming.map((u, idx) => (
                  <li key={idx}>{u}</li>
                ))}
              </ul>
            </div>
          )}

          {/* TIMELINE */}
          {tower.timeline?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Progress Timeline</h4>
              <div className="flex gap-3 overflow-x-auto">
                {tower.timeline.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-[120px] h-[80px] flex-shrink-0 rounded-lg overflow-hidden border"
                  >
                    <img
                      src={img}
                      alt="timeline"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
      </div>

    </div>
  </div>
</div>
