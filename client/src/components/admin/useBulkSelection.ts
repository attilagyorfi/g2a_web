/**
 * Hook for managing multi-select state across an admin list.
 *
 * Usage:
 *   const sel = useBulkSelection<number>(filteredList.map(r => r.id));
 *   <input type="checkbox" checked={sel.isSelected(r.id)} onChange={() => sel.toggle(r.id)} />
 *   {sel.count > 0 && <BulkActionBar count={sel.count} onCancel={sel.clear} ... />}
 *
 * The `availableIds` prop is the list of IDs currently visible in the table
 * (after any filters applied). Select-all toggles all visible items, not the
 * full DB.
 */
import { useCallback, useMemo, useState } from "react";

export function useBulkSelection<T extends string | number>(availableIds: T[]) {
  const [selectedSet, setSelectedSet] = useState<Set<T>>(new Set());

  const toggle = useCallback((id: T) => {
    setSelectedSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelectedSet(new Set()), []);

  const selectAll = useCallback(() => {
    setSelectedSet(new Set(availableIds));
  }, [availableIds]);

  const isSelected = useCallback((id: T) => selectedSet.has(id), [selectedSet]);

  const allSelected = useMemo(
    () => availableIds.length > 0 && availableIds.every((id) => selectedSet.has(id)),
    [availableIds, selectedSet],
  );
  const someSelected = useMemo(
    () => availableIds.some((id) => selectedSet.has(id)) && !allSelected,
    [availableIds, selectedSet, allSelected],
  );

  const toggleAll = useCallback(() => {
    if (allSelected) clear();
    else selectAll();
  }, [allSelected, clear, selectAll]);

  // Drop selections that are no longer in the visible list (e.g. after refetch)
  const ids = useMemo(() => Array.from(selectedSet), [selectedSet]);

  return {
    ids,
    count: selectedSet.size,
    isSelected,
    toggle,
    clear,
    selectAll,
    toggleAll,
    allSelected,
    someSelected,
  };
}
