import * as calendarService from './calendar.service.js';

export const createCalendar = async (req, res) => {
  try {
    const { name, type } = req.body;
    const userId = req.user.id;

    const data = await calendarService.createCalendar({
      name,
      type,
      created_by: userId
    });

    res.status(201).json({
      success: true,
      data
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const getCalendars = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await calendarService.getCalendars(userId);

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const deleteCalendar = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const data = await calendarService.deleteCalendar(id, userId);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Calendar not found or not owned by user"
      });
    }

    res.status(200).json({
      success: true,
      message: "Calendar deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const getUserCalendars = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await calendarService.getCalendarsByUser(userId);

    res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
