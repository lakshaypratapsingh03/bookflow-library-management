import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import logo from "../assets/logo-with-title.png";
import { toggleReceiptPopup } from "../store/slices/popUpSlice";
import { formatCourse } from "../utils/courses.js";
import { formatSemester } from "../utils/semesters.js";
import { isStaff } from "../utils/roles.js";

const formatDateTime = (timeStamp) => {
  if (!timeStamp) return "-";
  const date = new Date(timeStamp);
  if (Number.isNaN(date.getTime())) return "-";
  const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getFullYear())}`;
  const hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${String(hours % 12 || 12).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")} ${ampm}`;
  return `${formattedDate}  ${formattedTime}`;
};

const formatMoney = (amount) => `Rs. ${Number(amount || 0).toFixed(2)}`;

const FieldRow = ({ label, value, breakAll = false }) => (
  <div className="grid grid-cols-[110px_1fr] gap-x-3 items-start py-0.5">
    <span className="text-[13px] text-gray-500 shrink-0 leading-[1.65]">
      {label}
    </span>
    <span
      className={`text-[13px] font-medium text-gray-800 leading-[1.65] ${
        breakAll ? "break-all" : "break-words"
      }`}
    >
      {value}
    </span>
  </div>
);

const ReceiptPopup = ({ receipt, initialAction = null }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const staffView = isStaff(user?.role);
  const printRef = useRef(null);
  const actionRanRef = useRef(false);
  const [downloading, setDownloading] = useState(false);

  const price = Number(receipt?.price) || 0;
  const fine = Number(receipt?.fine) || 0;
  const total = price + fine;
  const isPaid = receipt?.paymentStatus === "Paid";
  const totalPaid = isPaid ? total : 0;

  const studentName =
    receipt?.studentName || receipt?.user?.name || receipt?.name || "-";
  const studentEmail =
    receipt?.studentEmail || receipt?.user?.email || receipt?.email || "-";
  const bookTitle =
    receipt?.bookTitle ||
    receipt?.title ||
    receipt?.book?.title ||
    "-";
  const bookAuthor = receipt?.author || receipt?.book?.author || "-";
  const courseLabel = receipt?.course ? formatCourse(receipt.course) : null;
  const semesterLabel = receipt?.semester
    ? formatSemester(receipt.semester)
    : null;

  const close = () => dispatch(toggleReceiptPopup());

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current || downloading) return;
    setDownloading(true);

    const el = printRef.current;
    const scrollParent = el.closest("[data-receipt-scroll]");
    const previous = {
      width: el.style.width,
      maxWidth: el.style.maxWidth,
      padding: el.style.padding,
      parentOverflow: scrollParent?.style.overflow,
      parentMaxHeight: scrollParent?.style.maxHeight,
    };

    try {
      // Fixed capture width so fields don't collapse into cramped columns.
      el.style.width = "720px";
      el.style.maxWidth = "720px";
      el.style.padding = "22px 28px";
      if (scrollParent) {
        scrollParent.style.overflow = "visible";
        scrollParent.style.maxHeight = "none";
      }

      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: 720,
        windowWidth: 720,
        scrollX: 0,
        scrollY: 0,
        // Global `overflow-x: hidden` on * clips text descenders in the capture.
        onclone: (clonedDoc) => {
          const area = clonedDoc.getElementById("receipt-print-area");
          if (!area) return;

          let node = area;
          while (node) {
            node.style.setProperty("overflow", "visible", "important");
            node.style.setProperty("overflow-x", "visible", "important");
            node.style.setProperty("overflow-y", "visible", "important");
            node.style.setProperty("max-height", "none", "important");
            node = node.parentElement;
          }

          area.querySelectorAll("*").forEach((child) => {
            child.style.setProperty("overflow", "visible", "important");
            child.style.setProperty("overflow-x", "visible", "important");
            child.style.setProperty("overflow-y", "visible", "important");
            child.style.setProperty("line-height", "1.65", "important");
            child.style.setProperty("text-rendering", "geometricPrecision", "important");
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 14;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;

      let imgWidth = maxWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      if (imgHeight > maxHeight) {
        const ratio = maxHeight / imgHeight;
        imgWidth *= ratio;
        imgHeight = maxHeight;
      }

      const x = margin + (maxWidth - imgWidth) / 2;
      pdf.addImage(imgData, "PNG", x, margin, imgWidth, imgHeight);
      pdf.save(
        `BookFlow-Receipt-${receipt?.receiptNumber || "receipt"}.pdf`
      );
    } catch (error) {
      console.error("Failed to download receipt PDF:", error);
    } finally {
      el.style.width = previous.width;
      el.style.maxWidth = previous.maxWidth;
      el.style.padding = previous.padding;
      if (scrollParent) {
        scrollParent.style.overflow = previous.parentOverflow || "";
        scrollParent.style.maxHeight = previous.parentMaxHeight || "";
      }
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (!initialAction || actionRanRef.current) return;
    actionRanRef.current = true;
    const timer = setTimeout(() => {
      if (initialAction === "print") {
        handlePrint();
      } else if (initialAction === "download") {
        handleDownloadPdf();
      }
    }, 450);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAction]);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 p-5 flex items-center justify-center z-50 receipt-modal-overlay">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg"
        data-receipt-scroll
      >
        <div className="flex justify-between items-center bg-[#156662] text-[#DDB287] px-6 py-4 rounded-t-lg receipt-no-print">
          <h2 className="text-lg font-bold">Borrow Receipt</h2>
          <button
            className="text-[#DDB287] text-lg font-bold w-8 h-8 border border-[#DDB287] flex items-center justify-center rounded-lg"
            onClick={close}
            type="button"
          >
            &times;
          </button>
        </div>

        <div
          id="receipt-print-area"
          ref={printRef}
          className="bg-white text-gray-800 px-6 py-5"
          style={{ boxSizing: "border-box" }}
        >
          <div className="flex items-start justify-between gap-6 border-b border-[#DDB287] pb-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={logo}
                alt="BookFlow"
                className="h-11 w-auto object-contain shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-[#156662] leading-[1.65]">
                  BookFlow Library
                </h1>
                <p className="text-xs text-gray-500 leading-[1.65]">
                  Library Management System
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[11px] uppercase tracking-wide text-gray-500 leading-[1.65]">
                Receipt No.
              </p>
              <p className="text-sm font-semibold text-[#156662] whitespace-nowrap leading-[1.65]">
                {receipt?.receiptNumber || "-"}
              </p>
              <span
                className={`inline-block mt-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded ${
                  isPaid
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {receipt?.paymentStatus || "Unpaid"}
              </span>
            </div>
          </div>

          <section className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#156662] mb-1.5 leading-[1.65]">
              Student Details
            </h3>
            <div>
              <FieldRow label="Name" value={studentName} />
              <FieldRow label="Email" value={studentEmail} breakAll />
              {courseLabel && <FieldRow label="Course" value={courseLabel} />}
              {semesterLabel && (
                <FieldRow label="Semester" value={semesterLabel} />
              )}
            </div>
          </section>

          <section className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#156662] mb-1.5 leading-[1.65]">
              Book Details
            </h3>
            <div>
              <FieldRow label="Title" value={bookTitle} />
              <FieldRow label="Author" value={bookAuthor} />
            </div>
          </section>

          <section className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#156662] mb-1.5 leading-[1.65]">
              Dates
            </h3>
            <div>
              <FieldRow
                label="Borrowed"
                value={formatDateTime(receipt?.borrowedDate)}
              />
              <FieldRow
                label="Due"
                value={formatDateTime(receipt?.dueDate)}
              />
              <FieldRow
                label="Returned"
                value={formatDateTime(receipt?.returnDate)}
              />
            </div>
          </section>

          <section className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#156662] mb-1.5 leading-[1.65]">
              Charges
            </h3>
            <table className="w-full text-[13px] border border-[#DDB287]">
              <tbody>
                <tr className="border-b border-[#DDB287]">
                  <td className="px-3 py-2 text-gray-600 leading-[1.65]">Book Price</td>
                  <td className="px-3 py-2 text-right font-medium whitespace-nowrap leading-[1.65]">
                    {formatMoney(price)}
                  </td>
                </tr>
                <tr className="border-b border-[#DDB287]">
                  <td className="px-3 py-2 text-gray-600 leading-[1.65]">Fine</td>
                  <td className="px-3 py-2 text-right font-medium whitespace-nowrap leading-[1.65]">
                    {formatMoney(fine)}
                  </td>
                </tr>
                <tr className="border-b border-[#DDB287] bg-[#F5E6C8]">
                  <td className="px-3 py-2 font-semibold text-[#156662] leading-[1.65]">
                    Total
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-[#156662] whitespace-nowrap leading-[1.65]">
                    {formatMoney(total)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-[#156662] leading-[1.65]">
                    Total Paid
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-[#156662] whitespace-nowrap leading-[1.65]">
                    {isPaid ? formatMoney(totalPaid) : "Rs. 0.00 (Due)"}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <p className="mt-5 text-center text-[11px] text-gray-500 border-t border-dashed border-gray-300 pt-3 leading-[1.65]">
            This is a computer-generated receipt and does not require a
            signature.
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg receipt-no-print">
          {!staffView && (
            <button
              type="button"
              onClick={handlePrint}
              className="border-2 border-[#DDB287] px-4 font-semibold bg-[#EAC9AA] text-[#104D4B] py-2 rounded-lg hover:bg-[#104D4B] hover:text-[#D4A373] transition"
            >
              Print
            </button>
          )}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="border-2 border-[#DDB287] px-4 font-semibold bg-[#156662] text-[#EAC9AA] py-2 rounded-lg hover:bg-[#104D4B] hover:text-[#D4A373] transition disabled:opacity-60"
          >
            {downloading ? "Downloading..." : "Download PDF"}
          </button>
          <button
            type="button"
            onClick={close}
            className="px-4 py-2 bg-gray-500 text-[#EAC9AA] rounded-md hover:bg-gray-700 hover:text-[#D4A373]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPopup;
