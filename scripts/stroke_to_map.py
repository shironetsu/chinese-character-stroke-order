import csv
import os


def main():
    csv_path = os.path.join(os.path.dirname(__file__),
                            "../stroke-seq_MB/单字码表/单字_笔顺码_29685个.txt")
    out_path = os.path.join(os.path.dirname(__file__), "../data/map.txt")
    with open(csv_path, 'r', encoding='UTF-8', newline='') as f:
        reader = csv.reader(f, delimiter='	')
        with open(out_path, 'w', encoding='UTF-8', newline='') as o:
            for row in reader:
                char = row[0]
                if len(char) > 1:
                    continue
                stroke = row[1]
                o.write(f"'{char}' => \"{stroke}\",\n")


if __name__ == '__main__':
    main()
