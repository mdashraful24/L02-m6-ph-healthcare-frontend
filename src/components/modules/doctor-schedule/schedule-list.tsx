"use client";

import { Suspense, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IScheduleParams, ScheduleStatus } from "@/types";
import ScheduleCreateDialog from "./schedule-create-dialog";
import ScheduleListLoading from "./schedule-list-loading";
import ScheduleTable from "./schedule-table";

const statuses: ["ALL" | ScheduleStatus, string][] = [
  ["ALL", "All"],
  ["DRAFT", "Draft"],
  ["PUBLISHED", "Published"],
];

export default function ScheduleList() {
  const [tab, setTab] = useState<"ALL" | ScheduleStatus>("ALL");

  const queryParams: IScheduleParams = {
    page: 1,
    limit: 10,
    sortBy: "startDateTime",
    sortOrder: "desc",
    ...(tab === "ALL" ? {} : { status: tab }),
  };

  return (
    <>
      <div className="my-5 flex justify-between gap-3">
        <Tabs value={tab} onValueChange={(value) => setTab(value)}>
          <TabsList>
            {statuses.map(([value, label]) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <ScheduleCreateDialog />
      </div>

      <Suspense fallback={<ScheduleListLoading />}>
        <ScheduleTable {...queryParams} />
      </Suspense>
    </>
  );
}
