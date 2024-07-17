import React, { ReactNode } from "react";

import { SVGProps } from "@/components/icons/svgHelpers";

type ButtonActionCallback = (
  event:
    | React.MouseEvent<HTMLButtonElement>
    | React.KeyboardEvent<HTMLButtonElement>,
) => void;

type FlightLinkGenerator = (year: number, day: number) => string;

type LinkProps = {
  linkText?: string;
  children?: ReactNode;
  href: string;
  onClick?: (event) => void;
};

export interface ResponseValidAt {
  response_valid_at: string;
}

export interface TransferImageEventResponse extends ResponseValidAt {
  code: string;
  image: string;
  image_recorded_datetime: string;
}

export interface VerkadaStreamDetails extends ResponseValidAt {
  url: string;
  expires_at: number;
}

export interface ApiListResponse<T> extends ResponseValidAt {
  links: Links;
  page: number;
  page_size: number;
  count: number;
  results: T[];
}

export { ButtonActionCallback, FlightLinkGenerator, LinkProps };

export type DayNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CheckedOrder {
  date: Date;
  errorSchedule: boolean;
  errorMaxDays: boolean;
}

export type ProjectLocations = Array<{
  value: string;
  label: string;
}>;

export interface ButtonIconProps extends SVGProps {
  size: "iconSmall" | "iconMedium";
  action?: ButtonActionCallback;
}
