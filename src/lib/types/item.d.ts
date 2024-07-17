interface Item {
  code: string;
  name: string;
  operator_safe_name: string;
  description: string;
  dangerous_goods: boolean;
  recipient_location_codes: string[];
}

interface OrderItem {
  name: string;
  quantity: number;
  code: string;
}
