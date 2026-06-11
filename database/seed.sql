-- Minimal seed data for prototype testing.

insert into branches (branch_name, location)
values
  ('Local', 'Indonesia'),
  ('Malaysia', 'Malaysia')
on conflict do nothing;

insert into chart_of_accounts (account_code, account_name, account_type)
values
  ('1000', 'Cash / Bank Manual', 'asset'),
  ('1100', 'Accounts Receivable', 'asset'),
  ('4000', 'Sales Revenue', 'revenue'),
  ('5000', 'Cost of Goods Sold', 'cost_of_goods_sold'),
  ('6000', 'Operating Expense', 'expense')
on conflict (account_code) do nothing;
