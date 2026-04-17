"use client";

import { List } from "react-window";
import { User } from "../../../lib/mock-db";

interface VirtualizedTableProps {
  users: User[];
}

const ROW_HEIGHT = 48;
const HEADER_HEIGHT = 44;

interface RowProps {
  users: User[];
}

function Row({
  index,
  style,
  users,
}: {
  index: number;
  style: React.CSSProperties;
  users: User[];
}) {
  const user = users[index];
  return (
    <div
      style={style}
      className={`flex items-center border-b border-zinc-200 px-4 text-sm dark:border-zinc-800 ${
        index % 2 === 0
          ? "bg-white dark:bg-zinc-950"
          : "bg-zinc-50 dark:bg-zinc-900"
      }`}
    >
      <span className="w-20 font-mono text-zinc-500 dark:text-zinc-400">
        {user.id}
      </span>
      <span className="flex-1 font-medium text-zinc-900 dark:text-zinc-100">
        {user.name}
      </span>
      <span className="flex-1 text-zinc-600 dark:text-zinc-300">
        {user.email}
      </span>
    </div>
  );
}

export default function VirtualizedTable({ users }: VirtualizedTableProps) {
  const tableHeight = Math.min(ROW_HEIGHT * users.length, 600);

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div
        className="flex items-center border-b border-zinc-200 bg-zinc-100 px-4 dark:border-zinc-700 dark:bg-zinc-900"
        style={{ height: HEADER_HEIGHT }}
      >
        <span className="w-20 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          ID
        </span>
        <span className="flex-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Name
        </span>
        <span className="flex-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Email
        </span>
      </div>
      <List<RowProps>
        defaultHeight={tableHeight}
        rowComponent={Row}
        rowCount={users.length}
        rowHeight={ROW_HEIGHT}
        rowProps={{ users }}
        overscanCount={5}
        className="!overflow-y-auto"
      />
    </div>
  );
}
