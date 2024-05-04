import React from "react";
import {ResizablePanel} from "@/components/ui/resizable";
import {DataTable} from "./data-table";
import {columns} from "./columns";
import {Input} from "@/components/ui/input";

type Created = {
  defaultLayout: number[];
};
export const PermissionsContent: React.FC<Created> = ({defaultLayout, ...props}) => {
  return <ResizablePanel defaultSize={100 - defaultLayout[0]} minSize={30}>
    <div className={'w-2/3 space-y-2 mx-auto my-10'}>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          // value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          // onChange={(event) =>
          //   table.getColumn("email")?.setFilterValue(event.target.value)
          // }
          className="max-w-sm"
        />
      </div>
      <DataTable columns={columns} data={[{
        id: '1',
        email: 'hocgin@gmail.com',
        isSuperAdmin: true,
        readMail: 'all',
        sentMail: 'all',
      }, {
        id: '2',
        email: 'test@hocg.in',
        isSuperAdmin: false,
        readMail: 'c1@hocg.in、c2@hocg.in',
        sentMail: 'c1@hocg.in、c2@hocg.in',
      }, {
        id: '3',
        email: '其他',
        isSuperAdmin: false,
        readMail: 'no',
        sentMail: 'no',
      }]} />
    </div>
  </ResizablePanel>;
};
