import pandas as pd

# Ссылка на CSV файл
link = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2LFRU7ZXov62daz3wwDwlFV6DLkrcV992V3lwYaI_c3NTnGdHzNJctIM8TwoJYrOEwzN9cIf7DXZL/pub?gid=1076661185&single=true&output=csv"

# Чтение данных из CSV в pandas DataFrame
df = pd.read_csv(link)

# Преобразование строк в множества Python
df['notes_set'] = df['notes_set'].apply(eval)
df['scale'] = df['scale'].apply(eval)

# Преобразование в словарь
data_dict = {str(row['notes_set']): row['scale'] for _, row in df.iterrows()}

# Преобразование словаря в JSON через pandas
json_output = pd.Series(data_dict).to_json(orient='index', indent=4)

# Сохранение в файл
with open('output.json', 'w') as json_file:
    json_file.write(json_output)

print("Данные успешно сохранены в scales.js")
