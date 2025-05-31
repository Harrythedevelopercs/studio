import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-wound-image.ts';
import '@/ai/flows/summarize-hospital-report.ts';
import '@/ai/flows/suggest-medicine.ts';