import './editor/RecentlyUsedPresets.css';

function RecentlyUsedPresets({
  recentIds = [],
  presets = [],
  onSelectPreset,
  limit = 5,
  title = 'Recently used',
}) {
  const normalizedLimit = Number.isFinite(limit) ? limit : 5;
  const uniqueRecentIds = Array.from(new Set(Array.isArray(recentIds) ? recentIds : [])).slice(
    0,
    normalizedLimit
  );

  if (!uniqueRecentIds.length) return null;

  const byId = new Map((presets || []).map((p) => [p.id, p]));

  return (
    <div className="recently-used-presets" aria-label="Recently used presets">
      <div className="recently-used-presets__title">{title}</div>
      <div className="recently-used-presets__list">
        {uniqueRecentIds.map((id) => {
          const preset = byId.get(id);
          const label = preset?.label || id;

          return (
            <button
              key={id}
              type="button"
              className="recently-used-presets__chip"
              onClick={() => onSelectPreset && onSelectPreset(id)}
              title={label}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default RecentlyUsedPresets;

