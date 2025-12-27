from playwright.sync_api import sync_playwright

def verify_hero_section():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the hero section
        # Wait for the server to be ready
        try:
            page.goto("http://localhost:3000/heroSection", timeout=30000)

            # Wait for the canvas to be present (it has mixBlendMode 'screen')
            page.wait_for_selector('canvas', state='visible')

            # Wait a bit for animation to start
            page.wait_for_timeout(2000)

            # Take a screenshot
            page.screenshot(path="verification/hero_section.png")
            print("Screenshot taken successfully")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_hero_section()
