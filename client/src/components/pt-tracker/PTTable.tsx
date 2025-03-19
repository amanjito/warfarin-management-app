import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PtTest } from "@shared/schema";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";

interface PTTableProps {
  ptTests: PtTest[];
  onEdit?: (test: PtTest) => void;
  onDelete?: (test: PtTest) => void;
  showAll?: boolean;
}

export default function PTTable({ ptTests, onEdit, onDelete, showAll = false }: PTTableProps) {
  // Show all tests or just the most recent (up to 4)
  const displayTests = showAll ? ptTests : ptTests.slice(0, 4);
  
  // Helper to determine status label and color based on INR value
  const getStatusBadge = (inrValue: number) => {
    if (inrValue >= 2.0 && inrValue <= 3.0) {
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">در محدوده</Badge>;
    } else if (inrValue < 2.0) {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">زیر محدوده</Badge>;
    } else {
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">بالای محدوده</Badge>;
    }
  };
  
  if (ptTests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        هنوز آزمایش PT ثبت نشده است. از فرم بالا برای افزودن اولین آزمایش استفاده کنید.
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-right">تاریخ</TableHead>
            <TableHead className="text-right">مقدار INR</TableHead>
            <TableHead className="text-right">وضعیت</TableHead>
            <TableHead className="hidden md:table-cell text-right">یادداشت‌ها</TableHead>
            {(onEdit || onDelete) && (
              <TableHead className="w-[100px] text-center">عملیات</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayTests.map((test) => (
            <TableRow key={test.id}>
              <TableCell className="font-medium whitespace-nowrap text-right">
                {format(new Date(test.testDate), "MMM dd, yyyy")}
              </TableCell>
              <TableCell className="font-medium text-right">{test.inrValue.toFixed(1)}</TableCell>
              <TableCell className="text-right">{getStatusBadge(test.inrValue)}</TableCell>
              <TableCell className="hidden md:table-cell text-gray-500 truncate max-w-[200px] text-right">
                {test.notes || "—"}
              </TableCell>
              {(onEdit || onDelete) && (
                <TableCell className="flex justify-center gap-2">
                  {onEdit && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEdit(test)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">ویرایش</span>
                    </Button>
                  )}
                  {onDelete && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDelete(test)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">حذف</span>
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
