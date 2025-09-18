paths:
	find . -type f \
		-not -path "./scrap/*" \
		-not -path "./.git/*" \
		-not -path "./node_modules/*" \
		| sed 's|^\./||' > scrap/txt/paths.txt

content:
	@> scrap/txt/contents.txt
	@for target in $(filter-out $@,$(MAKECMDGOALS)); do \
		if [ -d "$$target" ]; then \
			find "$$target" -type f \
				! -path "*/node_modules/*" \
				! -path "app/favicon.ico" \
				! -path "*/scrap/*" | while read -r file; do \
				echo "=== $$file ===" >> scrap/txt/contents.txt; \
				cat "$$file" >> scrap/txt/contents.txt; \
			done; \
		else \
			echo "=== $$target ===" >> scrap/txt/contents.txt; \
			cat "$$target" >> scrap/txt/contents.txt; \
		fi; \
	done

stagedp:
	git diff --name-only --cached > scrap/txt/staged_paths.txt