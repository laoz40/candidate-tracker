CREATE TYPE "public"."candidate_stage" AS ENUM('Applied', 'Screening', 'Interview', 'Offer', 'Rejected');--> statement-breakpoint
CREATE TABLE "candidate_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"role" text NOT NULL,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"stage" "candidate_stage" DEFAULT 'Applied' NOT NULL,
	"source" text,
	"resume" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "candidate_notes" ADD CONSTRAINT "candidate_notes_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;