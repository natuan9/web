import odoo.tests
from odoo.tests import HttpCase, tagged


@tagged("-at_install", "post_install")
class TestQunit(HttpCase):
    @odoo.tests.no_retry
    def test_qunit(self):
        self.browser_js(
            "/web/tests?suite=ad791ca3",
            "",
            "",
            login="admin",
        )
