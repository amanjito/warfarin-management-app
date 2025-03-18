import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PtTest } from "@shared/schema";
import { format } from "date-fns";

interface PTTableProps {
  ptTests: PtTest[];
}

export default function PTTable({ ptTests }: PTTableProps) {
  // Only show the most recent tests (up to 4)
  const recentTests = ptTests.slice(0, 4);
  
  // Helper to determine status label and color based on INR value
  const getStatusBadge = (inrValue: number) => {
    if (inrValue >= 2.0 && inrValue <= 3.0) {
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">In Range</Badge>;
    } else if (inrValue < 2.0) {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Below Range</Badge>;
    } else {
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Above Range</Badge>;
    }
  };
  
  if (ptTests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No PT tests recorded yet. Use the form above to add your first test.
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>INR Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentTests.map((test) => (
            <TableRow key={test.id}>
              <TableCell className="font-medium whitespace-nowrap">
                {format(new Date(test.testDate), "MMM dd, yyyy")}
              </TableCell>
              <TableCell className="font-medium">{test.inrValue.toFixed(1)}</TableCell>
              <TableCell>{getStatusBadge(test.inrValue)}</TableCell>
              <TableCell className="hidden md:table-cell text-gray-500 truncate max-w-[200px]">
                {test.notes || "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
