paths:
	find . -type f \
		-not -path "./scrap/*" \
		-not -path "./.next/*" \
		-not -path "./.git/*" \
		-not -path "./seed-data/*" \
		-not -path "./node_modules/*" \
		| sed 's|^\./||' > scrap/txt/paths.txt

content:
	@> scrap/txt/contents.txt
	@for target in $(filter-out $@,$(MAKECMDGOALS)); do \
		if [ -d "$$target" ]; then \
			find "$$target" -type f \
				! -path "*/node_modules/*" \
				! -path "*/.next/*" \
				! -path "*/seed-data/*" \
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

backend-seed:
	@echo "🌱 Starting recipe seeding process..."
	@node scripts/generate-seed-data.js
	@echo "✅ Seeding complete! The recipes.json file has been created."
	@echo "💡 To load the data in your app, use the useSeedData hook or visit the /api/seed endpoint."