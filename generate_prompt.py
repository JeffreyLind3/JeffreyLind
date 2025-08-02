"""
This module generates a markdown file (codebase.md) that documents the
codebase by including the contents of source files from the 'src' directory
and specific root files, formatted as code blocks with appropriate language
highlighting.
"""

import os


def get_language(filename):
    """
    Determine the programming language or file type based on the filename
    extension.

    Args:
        filename (str): The name of the file, including its extension.

    Returns:
        str: The language or file type identifier (e.g., 'python',
        'javascript'), defaults to 'text' if the extension is not recognized.
    """
    if filename == ".env.example":
        return "ini"
    ext = os.path.splitext(filename)[1].lower()
    languages = {
        ".py": "python",
        ".js": "javascript",
        ".jsx": "javascript",
        ".ts": "typescript",
        ".tsx": "typescript",
        ".json": "json",
        ".md": "markdown",
        ".html": "html",
        ".css": "css",
        ".scss": "scss",
        ".yaml": "yaml",
        ".yml": "yaml",
        ".toml": "toml",
        ".ini": "ini",
        ".txt": "text",
        ".sh": "bash",
        ".bat": "batch",
        ".sql": "sql",
        ".java": "java",
        ".c": "c",
        ".cpp": "cpp",
        ".cs": "csharp",
        ".go": "go",
        ".rb": "ruby",
        ".php": "php",
        ".rs": "rust",
    }
    return languages.get(ext, "text")


OUTPUT_FILE = "codebase.md"
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    # Collect and sort src files
    src_files = []
    for root_dir, dirs, files in os.walk("src"):
        for file in files:
            full_path = os.path.join(root_dir, file)
            rel_path = os.path.normpath(full_path).replace("\\", "/")
            src_files.append(rel_path)
    src_files.sort()

    for rel_path in src_files:
        try:
            with open(rel_path, "r", encoding="utf-8") as code_file:
                content = code_file.read()
        except UnicodeDecodeError:
            # Skip binary files or handle differently
            f.write(f"{rel_path} (binary or non-UTF-8 file skipped)\n\n")
            continue
        lang = get_language(os.path.basename(rel_path))
        f.write(f"{rel_path}\n")
        f.write(f"```{lang}\n")
        f.write(content)
        f.write("\n```\n\n")

    # Root files
    root_files = [
        ".env.example",
        "middleware.ts",
        "package.json",
        "eslint.config.mjs",
        "next.config.ts",
        "postcss.config.mjs",
        "tsconfig.json",
    ]
    for file in root_files:
        if os.path.exists(file):
            try:
                with open(file, "r", encoding="utf-8") as code_file:
                    content = code_file.read()
            except UnicodeDecodeError:
                f.write(f"{file} (binary or non-UTF-8 file skipped)\n\n")
                continue
            lang = get_language(file)
            f.write(f"{file}\n")
            f.write(f"```{lang}\n")
            f.write(content)
            f.write("\n```\n\n")
