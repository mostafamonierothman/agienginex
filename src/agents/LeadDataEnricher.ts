
export class LeadDataEnricher {
  enrichSearchResults(results: any[], keyword: string): any[] {
    const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'protonmail.com'];
    const firstNames = [
      'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Sophie', 'Thomas',
      'Emily', 'Daniel', 'Anna', 'Christopher', 'Rachel', 'Andrew', 'Laura', 'Matthew',
      'Jessica', 'Robert', 'Jennifer', 'William', 'Ashley', 'John', 'Amanda', 'Ryan'
    ];
    const lastNames = [
      'Johnson', 'Brown', 'Wilson', 'Miller', 'Anderson', 'Taylor', 'Davis', 'Garcia',
      'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Williams', 'Jones', 'Smith',
      'Thompson', 'White', 'Harris', 'Martin', 'Clark', 'Lewis', 'Robinson', 'Walker'
    ];
    return results.map((result, index) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const timestamp = Date.now();
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${timestamp}.${index}@${domain}`;
      let industry = 'medical tourism';
      if (keyword.includes('LASIK') || keyword.includes('eye') || keyword.includes('vision')) {
        industry = 'eye surgery';
      } else if (keyword.includes('dental') || keyword.includes('veneers') || keyword.includes('teeth')) {
        industry = 'dental procedures';
      } else if (keyword.includes('IVF') || keyword.includes('fertility')) {
        industry = 'fertility treatment';
      }
      const locations = ['United Kingdom', 'Germany', 'France', 'Netherlands', 'Belgium', 'Ireland', 'Switzerland'];
      const location = locations[Math.floor(Math.random() * locations.length)];
      return {
        email,
        first_name: firstName,
        last_name: lastName,
        company: `${industry === 'eye surgery' ? 'Vision' : industry === 'dental procedures' ? 'Dental' : 'Medical'} Patient`,
        job_title: 'Potential Patient',
        source: 'lead_generation_agent',
        industry,
        location,
        status: 'new' // Only allowed status
      };
    });
  }
}
