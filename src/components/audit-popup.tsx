import { useEffect, useState } from "react";
import { X, Send, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import type { AuditPreview } from "@/lib/audit-preview.functions";

export HEAD
# Append the extracted block, but make AuditPopup exported. Replace "function AuditPopup" with "export function AuditPopup" using awk.
awk 'BEGIN{done=0} /^function AuditPopup\(/ && !done {print "export " $0; done=1; next} {print}' /tmp/audit_block.txt >> src/components/audit-popup.tsx
echo "---preview last 5---"
tail -5 src/components/audit-popup.tsx
echo "---head 15---"
head -15 src/components/audit-popup.tsx
