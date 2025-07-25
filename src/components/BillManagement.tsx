import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCafeContext } from '@/contexts/CafeContext';
import { Download, Eye, Printer } from 'lucide-react';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
const BillManagement: React.FC = () => {
  const { bills, tables } = useCafeContext();

  const handlePrint = (billId: string) => {
    const bill = bills.find(b => b.id === billId);
    if (!bill) return;
    
    const table = tables.find(t => t.id === bill.tableId);
    const printContent = `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 20px;">Cafe Bill</h2>
        <div style="border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 10px;">
          <p><strong>Table:</strong> ${table?.name || 'Unknown'}</p>
          <p><strong>Date:</strong> ${new Date(bill.createdAt).toLocaleString()}</p>
          <p><strong>Bill ID:</strong> ${bill.id}</p>
        </div>
        <div style="margin-bottom: 20px;">
          <h3>Items:</h3>
          ${bill.items.map(item => `
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span>${item.name} x${item.quantity}</span>
              <span>₹${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
        <div style="border-top: 1px solid #ccc; padding-top: 10px;">
          <div style="display: flex; justify-content: space-between; margin: 5px 0;">
            <span>Subtotal:</span>
            <span>₹${bill.subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 5px 0;">
            <span>Tax (18%):</span>
            <span>₹${bill.tax.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 10px 0; font-weight: bold; font-size: 18px;">
            <span>Total:</span>
            <span>₹${bill.total.toFixed(2)}</span>
          </div>
        </div>
        <p style="text-align: center; margin-top: 20px; font-size: 12px;">Thank you for visiting!</p>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = (billId: string) => {
  const bill = bills.find((b) => b.id === billId);
  if (!bill) return;

  const table = tables.find((t) => t.id === bill.tableId);
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Cafe Bill Receipt", 14, 20);

  doc.setFontSize(12);
  doc.text(`Bill ID: ${bill.id}`, 14, 30);
  doc.text(`Table: ${table?.name || "Unknown"}`, 14, 38);
  doc.text(`Date: ${new Date(bill.createdAt).toLocaleString()}`, 14, 46);

  const itemRows = bill.items.map((item: any) => [
    item.name,
    item.quantity,
    `Rs.${item.price}`,
    `Rs. ${item.quantity * item.price}`,
  ]);

  autoTable(doc, {
    startY: 55,
    head: [["Item", "Qty", "Price", "Total"]],
    body: itemRows,
  });

  const finalY = (doc as any).lastAutoTable.finalY || 55;

  doc.text(`Subtotal: Rs.${bill.subtotal.toFixed(2)}`, 14, finalY + 10);
  doc.text(`Tax: Rs.${bill.tax.toFixed(2)}`, 14, finalY + 18);
  doc.text(`Total: Rs.${bill.total.toFixed(2)}`, 14, finalY + 26);

  doc.save(`bill-${bill.id}.pdf`);
};

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bill Management</h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Bills: {bills.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bills.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No bills generated yet</p>
          </div>
        ) : (
          bills.map((bill) => {
            const table = tables.find(t => t.id === bill.tableId);
            return (
              <Card key={bill.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {table?.name || 'Unknown Table'}
                    </CardTitle>
                    <Badge className="bg-green-500 text-white">
                      Paid
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(bill.createdAt).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Bill ID: {bill.id}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Items:</div>
                      {bill.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>{item.name} x{item.quantity}</span>
                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>₹{bill.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax (18%):</span>
                        <span>₹{bill.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span className="text-green-600">₹{bill.total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrint(bill.id)}
                        className="flex-1"
                      >
                        <Printer className="w-4 h-4 mr-1" />
                        Print
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(bill.id)}
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BillManagement;