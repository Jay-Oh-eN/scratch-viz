  # var activity_data = data['activity_data'];
  # var active_user_data = data['active_user_data'];
  # var age_distribution_data = data['age_distribution_data'];
  # var project_data = data['project_data'];
  # var comment_data = data['comment_data'];
  # var country_distribution = data['country_distribution'];
  # var block_distribution = data['block_distribution'];

for table in data['activity_data']:
    filename = table['key'].replace(' ', '_').lower()

    with open(filename + '.csv' , 'w') as wfile:
        fieldnames = sorted(table['values'][0].keys())

        writer = csv.DictWriter(wfile, fieldnames=fieldnames)

        writer.writeheader()

        for d in table['values']:
            writer.writerow(d)