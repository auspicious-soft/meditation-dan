"use client"
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

const invoices = [
  {
    Id: "#0032",
    CompanyName: "Acme Corporation",
    registerdate: "08/01/2025",
    expireDate: "08/01/2025",
  },
  {
    Id: "#0033",
    CompanyName: "Acme Corporation",
    registerdate: "08/01/2025",
    expireDate: "08/01/2025",
  },
];

const SubscriptionReminder = () => {
  const router = useRouter()
  return (
    <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9 ">
    <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
    Subscriptions Expiring
    </h2>
    <div className=" w-full rounded-none overflow-hidden">
      <div className="w-full overflow-auto h-[210px] scroll-container">
        <Table className="min-w-[500px] scrollbar-thin scroll-container">
          <TableHeader>
            <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
              <TableHead className="w-[100px] py-4">ID</TableHead>
              <TableHead className="py-4">Company Name</TableHead>
              <TableHead className="py-4">Register Date</TableHead>
              <TableHead className="py-4">Expire Date</TableHead>
              <TableHead className="text-right py-4">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {invoices.map((invoice) => (
              <TableRow
                key={invoice.Id}
                className="border-0 text-sm font-normal hover:bg-transparent"
              >
                <TableCell className="py-4">{invoice.Id}</TableCell>
                <TableCell className="py-4">{invoice.CompanyName}</TableCell>
                <TableCell className="py-4">{invoice.registerdate}</TableCell>
                <TableCell className="py-4">{invoice.expireDate}</TableCell>
                <TableCell className="text-right py-4">
                  <Button className=" !bg-[#1a3f70] hover:cursor-pointer h-6 w-20 rounded inline-flex justify-center items-center text-white text-sm !font-normal !leading-tight !tracking-tight"
                  onClick={() => router.push("/admin/subscription-expiring/company-detail")}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    </div>
  );
};
export default SubscriptionReminder;
