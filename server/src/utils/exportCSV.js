export const exportCSV = (data, filename, res) => {
    if (!data.length) {
        return res.status(404).json({
            success: false,
            message: "No data found",
        });
    }

    const headers = Object.keys(data[0]);

    const rows = data.map(row =>
        headers.map(header => `"${row[header] ?? ""}"`).join(",")
    );

    const csv = [
        headers.join(","),
        ...rows,
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");

    res.setHeader(
        "Content-Disposition",
        `attachment; filename=${filename}`
    );

    res.status(200).send(csv);
};