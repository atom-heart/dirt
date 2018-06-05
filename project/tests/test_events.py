from unittest import TestCase
from project import app

class EventsTests(TestCase):

    #### Setup and teardown ###########################################
    ###################################################################

    def setUp(self):
        # Ensure testing, not debug mode
        app.config['TESTING'] = True
        app.config['DEBUG'] = False

        # Get instace of app test client
        self.app = app.test_client()

    def tearDown(self):
        pass


    #### Tests ########################################################
    ###################################################################

    def test_hello_world(self):
        response = self.app.get('/', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Hello, World!', response.data)
